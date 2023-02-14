import { camelCase } from "case-anything";
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

function sa_262_ii(templateChoice, renderOp, outFile) {

  let externalImageList = [];
  let imageList = [];
  let fontStyles = {};

  const windows = $.os.indexOf("Windows") !== -1,
    slash = windows ? "\\" : "/",
    wSpace = windows ? " " : "\\ ";

  const rmCmd = (path) =>
    windows ? "del /f \"" + path + "\"" : "rm " + path.replace(/(?:\\.)+|( )/g, "\\ ");

  project.log("We’re doing something!");
  status.text = "Yes, we are doing something";

  mdsRender(templateChoice, renderOp);

  function mdsRender(templateChoice, renderOp) {
    try {
      imageList = clone(template[templateChoice.name]["content_" + templateChoice.text]);
    } catch (e) {
      status.text = e;
    }

    var ORcompFolder = libItemsReg(Number(templateChoice.name.match(/[0-9]+$/g)[0]), "Folder", 1);
    status.text = "Found Comp Folder";
    var ORcomp = libItemsInFolder(regSafe(templateChoice.text), ORcompFolder, "Composition")[0];
    status.text = "Found Original Comp";

    if (prerequisites(templateChoice, ORcomp, ORcompFolder) === -1) return;
    /*pbar.value = 0;
    alert('Made it!'); return;*/
    pbar.value = 25;
    status.text = templateChoice.text;

    var comp = ORcomp.duplicate();

    fontStyles = fontStylesMaster[ORcomp.id];

    status.text = "Duplicated Comp";
    comp.name = compTitle.txt.text !== "" ? compTitle.txt.text : ORcomp.name;

    status.text = "Renamed Comp '" + comp.name + "'";
    var compFolder = app.project.items.addFolder(comp.name);
    status.text = "Created Folder '" + comp.name + "'";
    var userComps = libItemsReg(/User Comps/g, "Folder")[0];
    if (userComps == undefined) userComps = app.project.items.addFolder("User Comps");

    status.text = "Found or Created 'User Comps' Folder";

    //delete existing folder if needed
    if (libItemsInFolder("^" + regSafe(comp.name) + "$", userComps, "Folder").length > 0) {
      var matchList = libItemsInFolder("^" + regSafe(comp.name) + "$", userComps, "Folder");
      customEach(matchList, function (match) {
        match.remove();
      });
    }
    compFolder.parentFolder = userComps;
    comp.parentFolder = compFolder;

    if (importExternal(compFolder) === -1) return;

    status.text = comp.name;

    addLinkedPrecomps(ORcompFolder, compFolder, comp);

    pbar.value = 40;

    var retroLayers = [];

    //Get all compositions from any subfolder containing the word 'Precomps'
    var preComps = getPreComps(compFolder);

    //Get all layers in preComps that are linked outward.
    project.log("");
    customEach(preComps, function (item) {
      var retros = findLayers(/<<.*>>/g, item),
        retrols = findLayers(/![A-Z][a-z]*l[a-z]*\s/g, item),
        allSubs = findLayers(/.*/g, item);
      customEach(retros, function (ritem) {
        project.log(ritem.name);
        retroLayers.push({ layer: ritem, comp: item });
      });
      customEach(retrols, function (rlitem) {
        project.log(rlitem.name);
        retroLayers.push({ layer: rlitem, comp: item });
      });
      
      //        status.text = 'about to start loop';
      customEach(allSubs, function (layr) {
        relinkExp(layr);
        retroLayers.push({ layer: layr, comp: item });
      });
    });
    project.log("");

    //Fill template
    fillTemplate(comp, compFolder, templateChoice, renderOp);

    //relink other expressions
    function relinkExp(layr) {
      for (var i = 1; i <= layr.property("Effects").numProperties; i++) {
        var matchName = layr.property("Effects").property(i).matchName;

        if (matchName == "ADBE Fill" || matchName == "ADBE Color Control") {
          if (layr.property("Effects").property(i).property("Color").expressionEnabled) {
            var orExp = layr.property("Effects").property(i).property("Color").expression,
              expressionComp = orExp.match(/comp\(".*?"\)/)[0].slice(6, -2),
              newExp = orExp;

            var exReg = new RegExp(regSafe(expressionComp), "g");
            if (expressionComp === ORcomp.name) {
              newExp = orExp.replace(exReg, comp.name);
            } else {
              customEach(preComps, function (item) {
                if (expressionComp === item.name) {
                  item.name = "[" + comp.name + "] " + item.name;
                  newExp = orExp.replace(exReg, item.name);
                } else if (expressionComp === item.name.replace("[" + comp.name + "] ", "")) {
                  newExp = orExp.replace(exReg, item.name);
                }
              });
            }

            layr.property("Effects").property(i).property("Color").expression = newExp;
          }
        }
      }
    }

    //Go through the retro links and link them to new comp
    customEach(retroLayers, function (item) {
      project.log(`The END: ${item.layer.name}`);
      if (item.layer.property("Source Text") !== undefined && item.layer.property("Source Text").expressionEnabled) {
        project.log(item.layer.name);
        var orExp = item.layer.property("Source Text").expression,
          expressionComp = orExp.match(/comp\(".*?"\)/)[0].slice(6, -2),
          newExp = orExp;

        if (expressionComp === ORcomp.name) {
          var orReg = new RegExp(regSafe(ORcomp.name), "g");
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

        item.layer.property("Source Text").expression = newExp;

        var layerName = newExp
            .match(/"!T.*(?=")/)[0]
            .split(/"!T[a-z]*/g)[1]
            .replace(/(^\s*)|(\s*$)/g, ""),
          tabName = /\[.+\]/g.test(layerName);

        if (tabName) {
          tabName = layerName.match(/\[.+\]/g)[0].replace(/[[\]]/g, "");
          layerName = layerName.replace(/\[.+\](\s)+/g, "");
        } else {
          tabName = "Text Input";
        }

        var textValue = item.layer.text.sourceText.valueAtTime(0, false);

        item.layer.text.sourceText.expressionEnabled = false;
        setText(item.layer, item.comp, textValue);
        item.layer.text.sourceText.expressionEnabled = true;
      }

      status.text = "step 5: " + item.layer.name;
    });

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
    var editableLayers = findLayers(/^!T|^!I|^!V|^!C|^!G|^!A/g, comp);
    /* var retroLayers = [];*/

    //Get all compositions from any subfolder containing the word 'Precomps'
    var preComps = getPreComps(compFolder);

    //Get all layers in preComps that are tagged as editable and push them to the main array
    for (var i = 0; i < preComps.length; i++) {
      var editables = findLayers(/^!T|^!I|^!V|^!C|^!G|^!A/g, preComps[i]);

      for (var z = 0; z < editables.length; z++) {
        editableLayers.push(editables[z]);
      }
    }

    status.text = "Ready to fill layers";
    //Go through all editable layers and replace content
    for (var e = 0; e < editableLayers.length; e++) {
      const layer = editableLayers[e];
      project.log(`Replacing content on layer '${layer.name}'`);
      replaceContent(layer);
    }

    sendtoRender(comp, renderOp);

    function replaceContent(layer) {
      status.text = "filling first layer";

      var typeMatches = /^![A-Z][a-z]*\(.*\)/.test(layer.name)
          ? layer.name.match(/^![A-Z][a-z]*\(.*\)/g)
          : layer.name.match(/^![A-Z][a-z]*/g),
        typeHeader = typeMatches[typeMatches.length - 1],
        varType = typeHeader.match(/^![A-Z]/g)[0],
        typeOptions = typeHeader.match(/[a-z]/g),
        layerField,
        terminalReg = new RegExp(regSafe(typeHeader), "g"),
        tabObj = {
          T: "Text Input",
          I: "Image",
          V: "Video",
          C: "Colors",
          G: "Group",
          F: "Font Style",
        },
        tabDefault = tabObj[varType.replace("!", "")];

      if (arrIndex(typeOptions, "l") !== -1 || varType === "!F") return;

      if (typeOptions == null || typeOptions == undefined) typeOptions = [];
      status.text = "variables switched";

      var layerName = layer.name.split(terminalReg)[1].replace(/(^\s*)|(\s*$)/g, "");
      var tabName = /\[.+\]/g.test(layerName);

      status.text = "layer name defined: " + layerName;

      //Check if tab is specified : if not, use type default tab
      if (tabName) {
        tabName = layerName.match(/\[.+\]/g)[0].replace(/[[\]]/g, "");
        layerName = layerName.replace(/\[.+\](\s)+/g, "");
      } else {
        tabName = tabDefault;
      }
      status.text = "tab name defined: " + tabName;

      status.text = "checking if group";
      if (varType === "!G") {
        if (arrIndex(typeOptions, "v") !== -1) {
          var preCompLayers = findLayers(">> " + layerName + " <<", comp),
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
        for (var u = 1; u <= layer("Effects").numProperties; u++) {
          status.text = "Setting color #" + u;
          var nameData = layer("Effects").property(u).name;
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
        var thisText = layerField.txt.text;
        setText(layer, comp, thisText);
      }

      status.text = "checking if media layer";
      if ((varType === "!I" || varType === "!V") && layerField.media.text !== "") {
        var orSize = {
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
          ],
          innerComp = comp,
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
          var newMask = layer.Masks.addProperty("Mask"),
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
      project.log(varType);
      if(varType === "!A") {
        let testText = layerField;
        testText = testText.media ? testText.media: undefined;
        testText = testText.text ? testText.text: undefined;

        project.log(`!A: ${testText}`);
      }
      if (varType === "!A" && layerField.media.text !== "") {
        layer.replaceSource(libItemsReg(regSafe(layerField.media.text), "Footage", 1), false);
      }

      //Check to see if the layer needs to be turned on or off
      if (layerField.visCheck !== undefined) layer.enabled = Boolean(layerField.visCheck.value);

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
    var layerProp = textLayer.property("Source Text");
    var layerTextDoc = layerProp.value;
    var boxSize = layerTextDoc.boxText
      ? { width: layerTextDoc.boxTextSize[0], height: layerTextDoc.boxTextSize[1] }
      : undefined;
    var rectSize = layerTextDoc.boxText ? textLayer.sourceRectAtTime(0, false) : undefined;
    var alignment = ["c", "c"];
    // var scale = textLayer.transform.scale.value[0] / 100;
    var fontRatio = layerTextDoc.fontSize / layerTextDoc.leading;

    //Check for font styles

    status.text = "checking for font styles";
    if (/\(.*\)/.test(textLayer.name)) {
      var styleName = textLayer.name.match(/\(.*\)/)[0].slice(1, -1);

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
      var maxLines = Math.floor(layerTextDoc.boxTextSize[1] / layerTextDoc.leading);

      //Set the text to the new text and make the text box so large that it's bound to fit.
      layerTextDoc.text = newText;
      layerTextDoc.boxTextSize = [boxSize.width, boxSize.height * 10];
      layerProp.setValue(layerTextDoc);

      if (alignment[0] === "c" && textLayer.sourceRectAtTime(0, false).height < rectSize.height) {
        //Center the text if it's not the full height and the anchor is the center
        var layerPosition = textLayer.position.value;
        var adjust = (rectSize.height - textLayer.sourceRectAtTime(0, false).height) / 2;
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
    var comp = layer.containingComp;
    var curTime = comp.time;
    var layerAnchor = layer.anchorPoint.value;
    var x;
    var y;
    var cor = ["c", "c"];
    var rect = layer.sourceRectAtTime(curTime, false);

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

    var xAdd = (x - layerAnchor[0]) * (layer.scale.value[0] / 100);
    var yAdd = (y - layerAnchor[1]) * (layer.scale.value[1] / 100);

    layer.anchorPoint.setValue([x, y]);

    var layerPosition = layer.position.value;

    layer.position.setValue([layerPosition[0] + xAdd, layerPosition[1] + yAdd, layerPosition[2]]);

    return cor;
  }

  function sendtoRender(composition, renderOp) {
    if (renderOp === "compOnly") return; //skip all this

    //var nameOfFile = outFolder.txt//(fileName.txt.text === '') ? composition.name : fileName.txt.text;

    var resultFile = new File(outFile || outFolder.txt.text); // + slash + nameOfFile);
    var renderQueue = app.project.renderQueue;
    var render = renderQueue.items.add(composition);
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
    var ORprecomps = libItemsInFolder(/Precomps/g, folderName, "Folder")[0];
    if (ORprecomps == undefined) return;
    var newPrecomps = [];
    status.text = "found original precomp folder";
    var precompFolder = newFolder.items.addFolder(ORprecomps.name);
    status.text = "made new precomp folder";

    function copyPrecompFolder(oldLocation, newLocation) {
      for (var i = 1; i <= oldLocation.items.length; i++) {
        status.text = "looking for compositions " + i;
        if (oldLocation.items[i].typeName === "Composition") {
          var newComp = oldLocation.items[i].duplicate();
          newComp.name = oldLocation.items[i].name;
          newComp.parentFolder = newLocation;
          newPrecomps.push(newComp);
          var replaceLayer1 = findLayers(regSafe(">> " + newComp.name + " <<"), composition);

          if (replaceLayer1.length == 0) continue;
          customEach(replaceLayer1, function (layerRep) {
            layerRep.replaceSource(newComp, false);
          });
        } else if (oldLocation.items[i].typeName === "Folder") {
          var newFolder = newLocation.items.addFolder(oldLocation.items[i].name);
          copyPrecompFolder(oldLocation.items[i], newFolder);
        }
      }
    }

    copyPrecompFolder(ORprecomps, precompFolder);

    for (var z = 0; z < newPrecomps.length; z++) {
      status.text = "pre precomps " + z;

      for (var u = 0; u < newPrecomps.length; u++) {
        var replaceCount = 1;
        if (u === z) continue;
        var replaceLayer = findLayers(regSafe(">> " + newPrecomps[u].name + " <<"), newPrecomps[z]);
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
    externalImageList = [];
    status.text = "Checking for images";

    var editableLayers = allEditableLayers[templateName.name];

    for (var z = 0; z < editableLayers.length; z++) {
      var layer = editableLayers[z];
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

    var templateChildren = template[templateName.name]["content_" + templateName.text].children;
    for (var i = 0; i < templateChildren.length; i++) {
      var childChildren = templateChildren[i].children;

      for (var u = 0; u < childChildren.length; u++) {
        if (childChildren[u].text === "Visible") continue;

        var layerRef = imageList[templateChildren[i].name][childChildren[u].name];

        if (layerRef.media !== undefined) {
          if (imageTest(layerRef.media, "media file") === -1) return -1;
        } else if (layerRef.audio !== undefined) {
          if (imageTest(layerRef.audio, "audio file") === -1) return -1;
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
          var newColor = hexToRgb(/#/.test(colour) ? colour : "#" + colour);
          return newColor.r + ", " + newColor.g + ", " + newColor.b;
        } else {
          return colour;
        }
      } else {
        alert("'" + colour + "' not a valid color");
        return -1;
      }
    }

    function imageTest(imgT, fileT) {
      status.text = "Checking: " + imgT.text;
      if (/[\\\/]/g.test(imgT.text)) {
        externalImageList.push(imgT);
      } else if (imgT.text !== "" && libItemsReg(regSafe(imgT.text), "Footage").length === 0) {
        alert("Could not find " + fileT + " '" + imgT.text + "'");
        pbar.value = 0;
        return -1;
      }
      status.text = "is this the problem?";
    }
  }

  // IMPORT EXTERNAL IMAGES
  // ====
  function importExternal(cfolder) {
    for (var i = 0; i < externalImageList.length; i++) {
      var path = externalImageList[i].text,
        loadAttempt = 0;

      if (/\.bmp$/i.test(path)) loadAttempt = 1;

      status.text = "Loading External File: " + path.match(/[^\/\\]+\.([A-z]+)/g)[0];

      if (tryToLoad(path) !== -1) {
        status.text = "loaded external " + i;
      } else {
        return -1;
      }

      function tryToLoad(loadPath) {
        var io = new ImportOptions(File(loadPath));
        if (io.canImportAs(ImportAsType.FOOTAGE)) {
          //Change the field to just show the filename for later use
          externalImageList[i].text = new File(loadPath).name; //io.name; //(new File(path)).name;

          var fileLocation = String(new File(path).parent).replace(/%20/g, wSpace) + slash;
          console.log(fileLocation);
          var scriptLocation = String(new File($.fileName).parent).replace(/%20/g, wSpace);

          try {
            io.importAs = ImportAsType.FOOTAGE;
          } catch (e) {
            alert("Couldn't import");
          }

          var newObject;

          try {
            newObject = app.project.importFile(io);
            newObject.name = externalImageList[i].text;
            newObject.parentFolder = cfolder;

            externalImageList[i].text = newObject.id;
          } catch (e) {
            //status.text = 'Load error. Try as .bmp if image';
            if (loadAttempt === 0) {
              status.text = "Load error. Try as .bmp if image";
              //If we didn't already try it, try duplicating and importing as .bmp
              var read_file = new File(loadPath);
              try {
                loadAttempt = 1;
                read_file.copy(read_file.fsName.replace(/\.(gif|jpg|jpeg|tiff|png)$/i, ".bmp"));
                if (
                  tryToLoad(read_file.fsName.replace(/\.(gif|jpg|jpeg|tiff|png)$/i, ".bmp")) !== -1
                )
                  status.text = "successfully loadeded as .bmp";
              } catch (e) {
                alert(e);
              }
            } else if (loadAttempt === 1) {
              status.text = "Load error. Try as .webp if image";

              if (!/\.bmp$/i.test(path)) system.callSystem(rmCmd(loadPath));

              try {
                loadAttempt = 2;

                var extension = /\.png/i.test(path) ? "_copy.png" : ".png",
                  convCommand = windows
                    ? "\"" +
                      scriptLocation.replace("/c/", "C:\\").replace("/", "\\") +
                      slash +
                      "dwebp\" \"" +
                      path +
                      "\" -o \"" +
                      path.replace(/\.(gif|jpg|jpeg|tiff|png|bmp)$/i, extension) +
                      "\""
                    : scriptLocation +
                      slash +
                      "dwebp " +
                      path.replace(/(?:\\.)+|( )/g, "\\ ") +
                      " -o " +
                      path
                        .replace(/(?:\\.)+|( )/g, "\\ ")
                        .replace(/\.(gif|jpg|jpeg|tiff|png|bmp)$/i, extension);

                system.callSystem(convCommand);

                if (tryToLoad(path.replace(/\.(gif|jpg|jpeg|tiff|png|bmp)$/i, extension)) !== -1)
                  status.text = "successfully converted webp to .png";
              } catch (e) {
                alert(e);
              }
            } else {
              if (loadAttempt === 2) system.callSystem(rmCmd(loadPath));
              alert("Could not import " + String(new File(path).name));
              alert(e);
              pbar.value = 0;
              return -1;
            }
          }
          return 1;
        } else {
          alert("cannot import " + String(new File(path).name));
          pbar.value = 0;
          return -1;
        }
      }
    }
  }
}

export { sa_262_ii };
