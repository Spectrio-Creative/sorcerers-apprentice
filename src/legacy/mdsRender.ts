import camelCase from "just-camel-case";
import clone from "just-clone";
import { project } from "../globals/globals";
import {
  compTitle,
  outFolder,
  template,
  compBtn,
  queueBtn,
  renderBtn,
  pbar,
  status,
} from "../globals/project/menu";
import { findLayers, getPreComps, libItemsInFolder, libItemsReg, regSafe } from "../tools/ae";
import { colorize, hexToRgb } from "../tools/colors";
import { arrIndex, customEach } from "../tools/legacyTools";
import { fontStylesMaster, allEditableLayers } from "../globals/legacySupport";
import { locateOrLoadFile } from "../tools/fs";
import { RenderOp } from "../classes/Renderer";
// import stringify from "fast-safe-stringify";

function sa_262_ii(templateChoice: TabbedPanel, renderOp: RenderOp, outFile?: string) {
  let imageList = [];
  let fontStyles = {};

  status.text = "Preparing to render...";

  mdsRender(templateChoice, renderOp);

  function mdsRender(templateChoice, renderOp) {
    try {
      imageList = clone(template[templateChoice.name]["content_" + templateChoice.text]);
      project.log("imageList: " + (imageList as any).ss_type);
    } catch (e) {
      status.text = e;
    }

    const ORcompFolder: FolderItem = libItemsReg(
      Number(templateChoice.name.match(/[0-9]+$/g)[0]),
      "Folder",
      1
    ) as FolderItem;
    status.text = "Found Comp Folder";
    const ORcomp = libItemsInFolder(
      regSafe(templateChoice.text),
      ORcompFolder,
      "Composition"
    )[0] as CompItem;
    status.text = "Found Original Comp";

    if (prerequisites(templateChoice) === -1) return;
    /*pbar.value = 0;
    alert('Made it!'); return;*/
    pbar.value = 25;
    status.text = templateChoice.text;

    const comp = ORcomp.duplicate();

    fontStyles = fontStylesMaster[ORcomp.id];

    status.text = "Duplicated Comp";
    comp.name = compTitle.txt.text !== "" ? compTitle.txt.text : ORcomp.name;

    status.text = "Renamed Comp '" + comp.name + "'";
    const compFolder = app.project.items.addFolder(comp.name);
    status.text = "Created Folder '" + comp.name + "'";
    let userComps = libItemsReg(/User Comps/g, "Folder")[0];
    if (userComps == undefined) userComps = app.project.items.addFolder("User Comps");

    status.text = "Found or Created 'User Comps' Folder";

    //delete existing folder if needed
    if (libItemsInFolder("^" + regSafe(comp.name) + "$", userComps, "Folder").length > 0) {
      const matchList = libItemsInFolder("^" + regSafe(comp.name) + "$", userComps, "Folder");
      customEach(matchList, function (match) {
        match.remove();
      });
    }
    compFolder.parentFolder = userComps;
    comp.parentFolder = compFolder;

    status.text = comp.name;

    addLinkedPrecomps(ORcompFolder, compFolder, comp);

    pbar.value = 40;

    //Get all compositions from any subfolder containing the word 'Precomps'
    const preComps: CompItem[] = getPreComps(compFolder);
    const allComps = preComps;
    allComps.push(comp);

    //Get all layers in preComps that are linked outward.
    status.text = "Relinking Expressions";

    allComps.forEach((compItem) => {
      const allLayers = findLayers(/.*/g, compItem) as Layer[];
      allLayers.forEach((subLayer) => {
        relinkExp(subLayer, compItem);
      });
    });
    project.log("");

    //Fill template
    fillTemplate(comp, compFolder, templateChoice, renderOp);

    //relink other expressions
    function relinkExp(layer:Layer, compItem:CompItem) {
      for (let i = 1; i <= (layer.property("Effects") as PropertyGroup).numProperties; i++) {
        const matchName = layer.property("Effects").property(i).matchName;
        
        if (matchName == "ADBE Fill" || matchName == "ADBE Color Control") {
          const colorProperty:Property = layer.property("Effects").property(i).property("Color") as Property;
          if (colorProperty.expressionEnabled) {
            const orExp = colorProperty.expression,
              expressionComp = (orExp.match(/comp\(".*?"\)/) || [""])[0].slice(6, -2);
            let newExp = orExp;

            const exReg = new RegExp(regSafe(expressionComp), "g");
            if (expressionComp === ORcomp.name) {
              newExp = orExp.replace(exReg, comp.name);
            } else {
              customEach(preComps, function (item: CompItem) {
                if (expressionComp === item.name) {
                  item.name = "[" + comp.name + "] " + item.name;
                  newExp = orExp.replace(exReg, item.name);
                } else if (expressionComp === item.name.replace("[" + comp.name + "] ", "")) {
                  newExp = orExp.replace(exReg, item.name);
                }
              });
            }

            (layer.property("Effects").property(i).property("Color") as Property).expression = newExp;
          }
        }

      }
      
      if (
        layer instanceof TextLayer &&
        layer.property("Source Text") !== undefined &&
        (layer.property("Source Text") as Property).expressionEnabled
      ) {
        const orExp = (layer.property("Source Text") as Property).expression,
          expressionComp = orExp.match(/comp\(".*?"\)/)[0].slice(6, -2);
        let newExp = orExp;

        if (expressionComp === ORcomp.name) {
          const orReg = new RegExp(regSafe(ORcomp.name), "g");
          newExp = orExp.replace(orReg, comp.name);
        } else {
          customEach(preComps, function (item) {
            if (expressionComp === item.name) {
              item.name = "[" + comp.name + "] " + item.name;
              newExp = orExp.replace(expressionComp, item.name);
            } else if (expressionComp === item.name.replace("[" + comp.name + "] ", "")) {
              newExp = orExp.replace(expressionComp, item.name);
            }
          });
        }

        (layer.property("Source Text") as Property).expression = newExp;

        const textValue = layer.text.sourceText.valueAtTime(0, false);

        layer.text.sourceText.expressionEnabled = false;
        setText(layer, compItem, textValue);
        layer.text.sourceText.expressionEnabled = true;
      }
    }

    pbar.value = 100;
    status.text = "Script Finished";
    compBtn.active = true;
    compBtn.active = false;
    renderBtn.enabled = false;
    compBtn.text = "DONE";
    queueBtn.text = "RESET";
    renderBtn.text = "TOTAL RESET";
  }

  // EXPRESSION TO USE ON IMAGE LAYERS
  // ====
  function imgExpression(ratio, contain) {
    if (ratio === undefined) ratio = 1;
    if (ratio === "skip") return "";
    if (contain === "height" || contain === "width")
      return (
        "// This lets us get the " +
        contain +
        " of the image containing your content.\
layerSize = thisLayer.sourceRectAtTime(time)." +
        contain +
        ";\
\
// This lets us get the width of the current composition.\
compSize = thisComp." +
        contain +
        ";\
\
// we want to set the " +
        contain +
        " to a little over 100%;\
maximumSize = compSize * " +
        ratio +
        ";\
\
// Get the ratio\
percentNeeded = maximumSize / layerSize * 100;\
[percentNeeded, percentNeeded]"
      );
    return (
      "// Get layer info.\
layerWidth = thisLayer.sourceRectAtTime(time).width;\
layerHeight = thisLayer.sourceRectAtTime(time).height;\
layerRatio = layerWidth / layerHeight;\
// Get comp info.\
compWidth = thisComp.width;\
compHeight = thisComp.height;\
compRatio = compWidth / compHeight;\
// If the layer ratio is smaller the width is at play\
compNum = compHeight;\
layerNum = layerHeight;\
if(layerRatio <= compRatio) {\
	compNum = compWidth;\
	layerNum = layerWidth;\
}\
\
maximumNum = compNum * " +
      ratio +
      ";\
// Get the ratio\
percentNeeded = maximumNum / layerNum * 100;\
[percentNeeded, percentNeeded]"
    );
  }

  function fillTemplate(comp, compFolder, templateChoice, renderOp) {
    status.text = "Starting to fill the template";

    //Get all layers that are tagged as editable
    const editableLayers = findLayers(/^!T|^!I|^!V|^!C|^!G|^!A/g, comp) as Layer[];
    /* var retroLayers = [];*/

    //Get all compositions from any subfolder containing the word 'Precomps'
    const preComps = getPreComps(compFolder);

    //Get all layers in preComps that are tagged as editable and push them to the main array
    for (let i = 0; i < preComps.length; i++) {
      const editables = findLayers(/^!T|^!I|^!V|^!C|^!G|^!A/g, preComps[i]);

      for (let z = 0; z < editables.length; z++) {
        editableLayers.push(editables[z]);
      }
    }

    status.text = "Ready to fill layers";
    //Go through all editable layers and replace content
    for (let e = 0; e < editableLayers.length; e++) {
      const layer = editableLayers[e];
      project.log(`Replacing content on layer '${layer.name}'`);
      replaceContent(layer);
    }
    
    project.log("Content replaced, sending to render");

    sendtoRender(comp, renderOp);

    function replaceContent(layer) {
      status.text = "filling first layer";

      const typeMatches = /^![A-Z][a-z]*\(.*\)/.test(layer.name)
        ? layer.name.match(/^![A-Z][a-z]*\(.*\)/g)
        : layer.name.match(/^![A-Z][a-z]*/g);
      const  typeHeader = typeMatches[typeMatches.length - 1];
      const varType:VarType = typeHeader.match(/^![A-Z]/g)[0];

      const terminalReg = new RegExp(regSafe(typeHeader), "g");
      const tabObj = {
        T: "Text Input",
        I: "Image",
        V: "Video",
        C: "Colors",
        G: "Group",
        F: "Font Style",
        A: "Audio",
      };
      const tabDefault = tabObj[varType.replace("!", "")];

      let typeOptions = typeHeader.match(/[a-z]/g);
      let layerField;

      if (arrIndex(typeOptions, "l") !== -1 || varType === "!F") return;

      if (typeOptions == null || typeOptions == undefined) typeOptions = [];
      status.text = "variables switched";

      let layerName: string = layer.name.split(terminalReg)[1].replace(/(^\s*)|(\s*$)/g, "");
      const hasTabName: boolean = /\[.+\]/g.test(layerName);
      let tabName = "";

      status.text = "layer name defined: " + layerName;

      //Check if tab is specified : if not, use type default tab
      if (hasTabName) {
        tabName = layerName.match(/\[.+\]/g)[0].replace(/[[\]]/g, "");
        layerName = layerName.replace(/\[.+\](\s)+/g, "");
      } else {
        tabName = tabDefault;
      }
      status.text = "tab name defined: " + tabName;

      status.text = "checking if group";
      if (varType === "!G") {
        if (arrIndex(typeOptions, "v") !== -1) {
          const preCompLayers = findLayers(">> " + layerName + " <<", comp),
            onOrOff = imageList[camelCase(tabName)][camelCase(layerName)].value;

          customEach(preCompLayers, function (item) {
            item.enabled = onOrOff;
          });
        }
        return;
      }

      status.text = "checking if color";
      if (varType === "!C") {
        //If a color layer, get color effects
        status.text = "Looping through colors: " + tabName;
        for (let u = 1; u <= layer("Effects").numProperties; u++) {
          status.text = "Setting color #" + u;
          const nameData = layer("Effects").property(u).name;
          layerField = imageList[camelCase(tabName)][camelCase(nameData)];
          status.text = "Setting color #" + u + ": " + layerField.txt.text;
          if (layerField.txt.text === "") continue;
          layer.effect(nameData)("Color").setValue(colorize(layerField.txt.text));
        }
        return;
      }

      layerField = imageList[camelCase(tabName)][camelCase(layerName)];
      
      status.text = "checking if text layer";
      if (varType === "!T") {
        project.log("Set the text!");
        const thisText = layerField.txt.text;
        setText(layer, comp, thisText);
      }

      status.text = "checking if media layer";
      if ((varType === "!I" || varType === "!V") && layerField.media.text !== "") {
        project.log("Image or Video layers");
        const orSize = {
            width: layer.width * (layer.scale.value[0] / 100),
            height: layer.height * (layer.scale.value[1] / 100),
          },
          //   orCor = {
          //     x:
          //       layer.position.value[0] -
          //       layer.transform.anchorPoint.value[0] * (layer.scale.value[0] / 100),
          //     y:
          //       layer.position.value[1] -
          //       layer.transform.anchorPoint.value[1] * (layer.scale.value[1] / 100),
          //   },
          orPer = [
            layer.transform.anchorPoint.value[0] / layer.width,
            layer.transform.anchorPoint.value[1] / layer.height,
          ];
        let innerComp = comp,
          heightOrWidth = "width",
          ratio;

        if (layer.containingComp !== comp) innerComp = layer.containingComp;

        layer.replaceSource(libItemsReg(regSafe(layerField.media.text), "Footage", 1), false);

        if (layer.width / layer.height <= orSize.width / orSize.height) {
          if (arrIndex(typeOptions, "f") == -1 && arrIndex(typeOptions, "b") == -1) {
            ratio = orSize.height / innerComp.height;
            heightOrWidth = "height";
          } else {
            ratio = orSize.width / innerComp.width;
          }
        } else {
          if (arrIndex(typeOptions, "f") !== -1 || arrIndex(typeOptions, "b") !== -1) {
            ratio = orSize.height / innerComp.height;
            heightOrWidth = "height";
          } else {
            ratio = orSize.width / innerComp.width;
          }
        }

        if (arrIndex(typeOptions, "n") !== -1) {
          layer.scale.setValue([100, 100, 100]);
        } else {
          layer.transform.scale.expression = imgExpression(ratio, heightOrWidth);
        }

        if (arrIndex(typeOptions, "s") !== -1 && layer.transform.scale.value[0] > 100) {
          layer.transform.scale.expressionEnabled = false;
          layer.scale.setValue([100, 100, 100]);
        }

        //If set to 'fill' (f), then put a mask around the original shape and fill it
        if (arrIndex(typeOptions, "f") !== -1) {
          const newMask = layer.Masks.addProperty("Mask"),
            newMaskShape = newMask.property("maskShape"),
            newShape = newMaskShape.value,
            // anch = layer.transform.anchorPoint.value,
            // pos = layer.position.value,
            sca = layer.transform.scale.value,
            bounds = [
              ((layer.width * sca[0] * 0.01 - orSize.width) * orPer[0]) / (sca[0] * 0.01),
              ((layer.height * sca[1] * 0.01 - orSize.height) * orPer[1]) / (sca[1] * 0.01),
              ((layer.width * sca[0] * 0.01 - orSize.width) * orPer[0]) / (sca[0] * 0.01) +
                orSize.width / (sca[0] / 100),
              ((layer.height * sca[1] * 0.01 - orSize.height) * orPer[1]) / (sca[1] * 0.01) +
                orSize.height / (sca[1] / 100),
            ];

          newShape.vertices = [
            [bounds[0], bounds[1]],
            [bounds[0], bounds[3]],
            [bounds[2], bounds[3]],
            [bounds[2], bounds[1]],
          ];
          newShape.closed = true;
          newMaskShape.setValue(newShape);
        }
      }

      status.text = "checking if audio";
      if (varType === "!A") {
        let testText = layerField;
        testText = testText.media ? testText.media : undefined;
        testText = testText.text ? testText.text : undefined;

        project.log(`!A: ${testText}`);
      }
      if (varType === "!A" && layerField.media.text !== "") {
        layer.replaceSource(libItemsReg(regSafe(layerField.media.text), "Footage", 1), false);
      }

      //Check to see if the layer needs to be turned on or off
      if (layerField.visibilityToggle !== undefined) layer.enabled = Boolean(layerField.visibilityToggle.value);

      return;
    }

    return;
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////  TEXT LAYER AND RENDER FUNCS  /////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  // SET TEXT FUNCTION (THIS FILLS THE TEXT FIELDS WITH NEW TEXT AND ENSURES THAT THEY FIT IN THE ALLOTED SPACE)
  // ====
  function setText(textLayer, comp, newText) {
    status.text = "setting text: " + regSafe(newText);
    const layerProp = textLayer.property("Source Text");
    const layerTextDoc = layerProp.value;
    const boxSize = layerTextDoc.boxText
      ? { width: layerTextDoc.boxTextSize[0], height: layerTextDoc.boxTextSize[1] }
      : undefined;
    const rectSize = layerTextDoc.boxText ? textLayer.sourceRectAtTime(0, false) : undefined;
    let alignment = ["c", "c"];
    // var scale = textLayer.transform.scale.value[0] / 100;
    const fontRatio = layerTextDoc.fontSize / layerTextDoc.leading;

    //Check for font styles

    status.text = "checking for font styles";
    if (/\(.*\)/.test(textLayer.name)) {
      const styleName = textLayer.name.match(/\(.*\)/)[0].slice(1, -1);

      if (
        fontStyles[camelCase(styleName + " Style")] !== undefined &&
        imageList[fontStyles[camelCase(styleName + " Style")]][camelCase(styleName + " Style")].txt
          .text !== ""
      ) {
        layerTextDoc.font =
          imageList[fontStyles[camelCase(styleName + " Style")]][
            camelCase(styleName + " Style")
          ].txt.text;
      }
    }

    if (newText === "") {
      status.text = "Blank - skipping resize";
      layerTextDoc.text = newText;
      layerProp.setValue(layerTextDoc);
      return;
    }
    if (!layerTextDoc.boxText) {
      status.text = "No use of point text - skipping resize";
      layerTextDoc.text = newText;
      layerProp.setValue(layerTextDoc);
      return;
    }

    if (layerTextDoc.boxText && boxSize.height < layerTextDoc.leading * 1.75) {
      //==== // ======= // ====//
      //====               ====//
      //==== ONE LINE TEXT ====//
      //====               ====//
      //==== // ======= // ====//

      //Move anchor point and figure out where it is
      alignment = anchorPoint(textLayer, "rect");

      //Set the text to the new text and make the text box so large that it's bound to fit.
      layerTextDoc.text = newText;
      layerTextDoc.boxTextSize = [boxSize.width * 10, boxSize.height];
      layerProp.setValue(layerTextDoc);

      //Move the anchor point to the center or the right since we have a new TextBox size
      if (alignment[1] === "c") {
        textLayer.transform.anchorPoint.setValue([
          textLayer.transform.anchorPoint.value[0] + boxSize.width * 4.5,
          textLayer.transform.anchorPoint.value[1],
        ]);
      } else if (alignment[1] === "r") {
        textLayer.transform.anchorPoint.setValue([
          textLayer.transform.anchorPoint.value[0] + boxSize.width * 9,
          textLayer.transform.anchorPoint.value[1],
        ]);
      }

      //Add the scale expression then resize the box to fit the new text
      textLayer.transform.scale.expression = textExpression(
        layerTextDoc.fontSize,
        boxSize.width / comp.width
      );
      layerTextDoc.boxTextSize = [
        Math.ceil(
          boxSize.width / (textLayer.transform.scale.value[0] / 100) +
            layerTextDoc.fontSize * (textLayer.transform.scale.value[0] / 100)
        ),
        boxSize.height,
      ];
      layerProp.setValue(layerTextDoc);

      //Move the anchor point to the center or the right since we have a new TextBox size
      if (alignment[1] === "c")
        textLayer.transform.anchorPoint.setValue([
          textLayer.transform.anchorPoint.value[0] -
            (boxSize.width * 5 - layerTextDoc.boxTextSize[0] / 2),
          textLayer.transform.anchorPoint.value[1],
        ]);
      if (alignment[1] === "r")
        textLayer.transform.anchorPoint.setValue([
          textLayer.transform.anchorPoint.value[0] -
            (boxSize.width * 10 - layerTextDoc.boxTextSize[0]),
          textLayer.transform.anchorPoint.value[1],
        ]);
    } else {
      status.text = "Paragraph text takes longer";

      //==== // ======== // ====//
      //====                ====//
      //==== MULTILINE TEXT ====//
      //====                ====//
      //==== // ======== // ====//

      //Move anchor point and figure out where it is
      alignment = anchorPoint(textLayer, "box");

      //Determine how many lines of text should fit
      const maxLines = Math.floor(layerTextDoc.boxTextSize[1] / layerTextDoc.leading);

      //Set the text to the new text and make the text box so large that it's bound to fit.
      layerTextDoc.text = newText;
      layerTextDoc.boxTextSize = [boxSize.width, boxSize.height * 10];
      layerProp.setValue(layerTextDoc);

      if (alignment[0] === "c" && textLayer.sourceRectAtTime(0, false).height < rectSize.height) {
        //Center the text if it's not the full height and the anchor is the center
        const layerPosition = textLayer.position.value;
        const adjust = (rectSize.height - textLayer.sourceRectAtTime(0, false).height) / 2;
        textLayer.position.setValue([
          layerPosition[0],
          layerPosition[1] + adjust,
          layerPosition[2],
        ]);
      } else if (layerTextDoc.baselineLocs.length / 4 > maxLines) {
        //Resize if too big for the textbox
        while (textLayer.sourceRectAtTime(0, false).height > boxSize.height) {
          diminish();
        }
      }

      //Resize the textbox to it's original size
      layerTextDoc.boxTextSize = [boxSize.width, boxSize.height];
      layerProp.setValue(layerTextDoc);
    }

    //function to reduce the textsize by one point until it fits
    function diminish() {
      layerTextDoc.fontSize -= 1;
      layerTextDoc.leading = layerTextDoc.fontSize / fontRatio;
      layerProp.setValue(layerTextDoc);
      //layerTextDoc = textLayer.sourceText.value;
    }
  }

  // EXPRESSION TO USE ON TEXT LAYERS
  // ====
  function textExpression(minTextSize, maxWidth) {
    if (minTextSize === "skip" || maxWidth === "skip") return "";
    return (
      "// This lets us get the width of the textbox containing your content.\
layerWidth = thisLayer.sourceRectAtTime(time).width;\
layerHeight = thisLayer.sourceRectAtTime(time).height;\
\
// This lets us get the width of the current composition.\
compWidth = thisComp.width;\
\
// we want to set the width to a little over 100%;\
maximumWidth = compWidth * " +
      maxWidth +
      ";\
\
// but we don't want it to be too big if it's a short line\
maximumHeight = " +
      minTextSize +
      ";\
// Get the ratio\
forWidth = maximumWidth / layerWidth * 100;\
forHeight = maximumHeight / layerHeight * 100;\
percentNeeded = (forWidth > forHeight) ? forHeight : forWidth;\
percentNeeded = (percentNeeded < 100) ? percentNeeded : 100;\
[percentNeeded, percentNeeded]"
    );
  }

  // ANCHOR POINT FUNCTION (FOR USE WITH TEXT, THIS MOVES THE ANCHOR POINT TO A REASONABLE PLACE)
  // ====
  function anchorPoint(layer, bound) {
    const comp = layer.containingComp;
    const curTime = comp.time;
    const layerAnchor = layer.anchorPoint.value;
    let x;
    let y;
    const cor = ["c", "c"];
    const rect = layer.sourceRectAtTime(curTime, false);

    switch (layer.sourceText.value.justification) {
    case ParagraphJustification.RIGHT_JUSTIFY:
      cor[1] = "r";
      break;
    case ParagraphJustification.LEFT_JUSTIFY:
      cor[1] = "l";
      break;
    case ParagraphJustification.CENTER_JUSTIFY:
    case ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT:
    case ParagraphJustification.FULL_JUSTIFY_LASTLINE_RIGHT:
    case ParagraphJustification.FULL_JUSTIFY_LASTLINE_CENTER:
    case ParagraphJustification.FULL_JUSTIFY_LASTLINE_FULL:
      cor[1] = "c";
      break;
    default:
      cor[1] = "c";
      break;
    }

    if (bound === "box") {
      if (
        layer.anchorPoint.value[1] <=
        layer.sourceText.value.boxTextPos[1] + layer.sourceText.value.boxTextSize[1] / 4
      ) {
        cor[0] = "t";
      } else if (
        layer.anchorPoint.value[1] >=
        layer.sourceText.value.boxTextPos[1] + (3 * layer.sourceText.value.boxTextSize[1]) / 4
      ) {
        cor[0] = "b";
      }

      switch (cor[1]) {
      case "l":
        x = layer.sourceText.value.boxTextPos[0];
        break;
      case "r":
        x = layer.sourceText.value.boxTextSize[0];
        x += layer.sourceText.value.boxTextPos[0];
        break;
      default:
        x = layer.sourceText.value.boxTextSize[0] / 2;
        x += layer.sourceText.value.boxTextPos[0];
        break;
      }

      switch (cor[0]) {
      case "t":
        y = layer.sourceText.value.boxTextPos[1];
        break;
      case "b":
        y = layer.sourceText.value.boxTextSize[1];
        y += layer.sourceText.value.boxTextPos[1];
        break;
      default:
        y = layer.sourceText.value.boxTextSize[1] / 2;
        y += layer.sourceText.value.boxTextPos[1];
        break;
      }
    } else {
      if (layer.anchorPoint.value[1] <= rect.top + rect.height / 4) {
        cor[0] = "t";
      } else if (layer.anchorPoint.value[1] >= rect.top + (3 * rect.height) / 4) {
        cor[0] = "b";
      }

      switch (cor[1]) {
      case "l":
        x = layer.sourceRectAtTime(curTime, false).left;
        break;
      case "r":
        x = layer.sourceRectAtTime(curTime, false).width;
        x += layer.sourceRectAtTime(curTime, false).left;
        break;
      default:
        x = layer.sourceRectAtTime(curTime, false).width / 2;
        x += layer.sourceRectAtTime(curTime, false).left;
        break;
      }

      switch (cor[0]) {
      case "t":
        y = layer.sourceRectAtTime(curTime, false).top;
        break;
      case "b":
        y = layer.sourceRectAtTime(curTime, false).height;
        y += layer.sourceRectAtTime(curTime, false).top;
        break;
      default:
        y = layer.sourceRectAtTime(curTime, false).height / 2;
        y += layer.sourceRectAtTime(curTime, false).top;
        break;
      }
    }

    const xAdd = (x - layerAnchor[0]) * (layer.scale.value[0] / 100);
    const yAdd = (y - layerAnchor[1]) * (layer.scale.value[1] / 100);

    layer.anchorPoint.setValue([x, y]);

    const layerPosition = layer.position.value;

    layer.position.setValue([layerPosition[0] + xAdd, layerPosition[1] + yAdd, layerPosition[2]]);

    return cor;
  }

  function sendtoRender(composition, renderOp) {
    if (renderOp === "compOnly") return; //skip all this

    //var nameOfFile = outFolder.txt//(fileName.txt.text === '') ? composition.name : fileName.txt.text;

    const resultFile = new File(outFile || outFolder.txt.text); // + slash + nameOfFile);
    const renderQueue = app.project.renderQueue;
    const render = renderQueue.items.add(composition);
    render.outputModules[1].file = resultFile;

    if (renderOp === "aeQueueOnly") return;

    // Scripting support for Queue in AME.
    // Requires Adobe Media Encoder 11.0.
    {
      if (app.project.renderQueue.canQueueInAME == true) {
        // Send queued items to AME, but do not start rendering.
        //app.project.renderQueue.queueInAME(true);
        app.project.renderQueue.queueInAME(renderOp === "queueOnly" ? false : true);
      } else {
        alert("There are no queued items in the Render Queue.");
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  function addLinkedPrecomps(folderName, newFolder, composition) {
    status.text = "looking for original precomp folder";
    const ORprecomps = libItemsInFolder(/Precomps/g, folderName, "Folder")[0];
    if (ORprecomps == undefined) return;
    const newPrecomps = [];
    status.text = "found original precomp folder";
    const precompFolder = newFolder.items.addFolder(ORprecomps.name);
    status.text = "made new precomp folder";

    function copyPrecompFolder(oldLocation, newLocation) {
      for (let i = 1; i <= oldLocation.items.length; i++) {
        status.text = "looking for compositions " + i;
        if (oldLocation.items[i].typeName === "Composition") {
          const newComp = oldLocation.items[i].duplicate();
          newComp.name = oldLocation.items[i].name;
          newComp.parentFolder = newLocation;
          newPrecomps.push(newComp);
          const replaceLayer1 = findLayers(regSafe(">> " + newComp.name + " <<"), composition);

          if (replaceLayer1.length == 0) continue;
          customEach(replaceLayer1, function (layerRep) {
            layerRep.replaceSource(newComp, false);
          });
        } else if (oldLocation.items[i].typeName === "Folder") {
          const newFolder = newLocation.items.addFolder(oldLocation.items[i].name);
          copyPrecompFolder(oldLocation.items[i], newFolder);
        }
      }
    }

    copyPrecompFolder(ORprecomps, precompFolder);

    for (let z = 0; z < newPrecomps.length; z++) {
      status.text = "pre precomps " + z;

      for (let u = 0; u < newPrecomps.length; u++) {
        let replaceCount = 1;
        if (u === z) continue;
        const replaceLayer = findLayers(
          regSafe(">> " + newPrecomps[u].name + " <<"),
          newPrecomps[z]
        );
        status.text = "checking for " + newPrecomps[u].name + " in " + newPrecomps[z].name;

        if (replaceLayer.length == 0) continue;
        customEach(replaceLayer, function (preLayerRep) {
          preLayerRep.replaceSource(newPrecomps[u], false);
          status.text = "replaced " + replaceCount + " " + newPrecomps[u].name + " precomp";
          replaceCount++;
        });
      }
    }

    status.text = "precomps all linked";
    return;
  }

  // PREREQUISITE CHECKS
  // ====
  function prerequisites(templateName) {
    status.text = "Checking Prerequisites";
    status.text = "Checking for images";

    const editableLayers = allEditableLayers[templateName.name];

    for (let z = 0; z < editableLayers.length; z++) {
      const layer = editableLayers[z];
      if (/^!T[a-z]*/g.test(layer.name) && layer.position.numKeys > 0) {
        alert(
          "Layer Setup Error:\
The text layer \"" +
            layer.name +
            "\" contains position keyframes. These unfortunately mess with the script's ability to resize text. Please remove the keyframes. Maybe try adding them to a parent null layer instead!"
        );
        return -1;
      }
      if (
        (/^!I[a-z]*/g.test(layer.name) || /^!V[a-z]*/g.test(layer.name)) &&
        layer.scale.numKeys > 0
      ) {
        alert(
          "Layer Setup Warning:\
The image layer \"" +
            layer.name +
            "\" contains scale keyframes. These will be overwritten when the script is resizing the image. To avoid any problems that might result, try adding them to a parent null layer instead!"
        );
      }
    }

    // var templateChildren = imageList.children;

    const templateChildren = template[templateName.name]["content_" + templateName.text].children;
    for (let i = 0; i < templateChildren.length; i++) {
      const childChildren = templateChildren[i].children;

      for (let u = 0; u < childChildren.length; u++) {
        if (childChildren[u].text === "Visible") continue;

        const layerRef = imageList[templateChildren[i].name][childChildren[u].name];

        if (layerRef.media !== undefined) {
          if (imagePreparation(layerRef.media, "media file") === -1) return -1;
        } else if (layerRef.audio !== undefined) {
          if (imagePreparation(layerRef.audio, "audio file") === -1) return -1;
        } else if (layerRef.color !== undefined) {
          if (colorCheck(layerRef.txt.text) !== -1) {
            layerRef.txt.text = colorCheck(layerRef.txt.text);
          } else {
            return -1;
          }
        }
      }
    }

    return;

    function colorCheck(colour) {
      if (colour === "" || /^#{0,1}[0-9a-fA-F]{3,6} *$|[0-9]+, *[0-9]+, *[0-9]+ */g.test(colour)) {
        if (/^#{0,1}[0-9a-fA-F]{3,6} *$/.test(colour)) {
          const newColor = hexToRgb(/#/.test(colour) ? colour : "#" + colour);
          return newColor.r + ", " + newColor.g + ", " + newColor.b;
        } else {
          return colour;
        }
      } else {
        alert("'" + colour + "' not a valid color");
        return -1;
      }
    }

    function imagePreparation(imgT, fileT) {
      status.text = "Checking: " + imgT.text;
      const fileName = locateOrLoadFile(imgT.text);
      if(!fileName) {
        alert(`Could not find ${fileT} '${imgT.text}'`);
        return -1;
      }

      imgT.text = fileName;
    }
  }
}

export { sa_262_ii };
