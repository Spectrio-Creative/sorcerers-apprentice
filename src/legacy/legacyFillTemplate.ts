import camelCase from "just-camel-case";
import { status } from "../globals/project/status";
import { findLayers, getPreComps, libItemsReg, regSafe } from "../tools/ae";
import { setText } from "./legacyTextFunctions";
import { RenderOp } from "../classes/Renderer";
import { imgExpression, sendtoRender } from "./legacyFunctionality";
import { colorize } from "../tools/colors";
import { project } from "../globals/globals";

export interface ITemplateOptions {
  comp: CompItem;
  compFolder: FolderItem;
  renderOp: RenderOp;
  fontStyles: { [key: string]: string };
  panel: TabbedPanel;
  outFile?: string;
}

export default function fillTemplate({ comp, compFolder, renderOp, panel, fontStyles, outFile }: ITemplateOptions) {
  status.set("Starting to fill the template");

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

  status.set("Ready to fill layers");
  //Go through all editable layers and replace content
  for (let e = 0; e < editableLayers.length; e++) {
    const layer = editableLayers[e];
    replaceContent(layer);
  }

  // Find all text layers with expressions resize them
  // const textLayers = findLayers(/^!T/g, comp) as TextLayer[];

  sendtoRender(comp, renderOp, outFile);

  function replaceContent(layer: Layer) {
    status.set("filling first layer");

    project.log(`filling first layer: ${layer.name}`);

    const typeMatches = /^![A-Z][a-z]*\(.*\)/.test(layer.name)
      ? layer.name.match(/^![A-Z][a-z]*\(.*\)/g)
      : layer.name.match(/^![A-Z][a-z]*/g);
    const typeHeader = typeMatches[typeMatches.length - 1];
    const varType: VarType = typeHeader.match(/^![A-Z]/g)[0] as VarType;

    project.log("Set the first group of variables");

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

    const typeOptions = (typeHeader.match(/[a-z]/g) || []) as TypeOptions[];
    let layerField;

    if (typeOptions.indexOf("l") !== -1 || varType === "!F") return;

    status.set("variables switched");

    let layerName: string = layer.name.split(terminalReg)[1].replace(/(^\s*)|(\s*$)/g, "");
    const hasTabName: boolean = /\[.+\]/g.test(layerName);
    let tabName = "";

    status.set("layer name defined: " + layerName);

    //Check if tab is specified : if not, use type default tab
    if (hasTabName) {
      tabName = layerName.match(/\[.+\]/g)[0].replace(/[[\]]/g, "");
      layerName = layerName.replace(/\[.+\](\s)+/g, "");
    } else {
      tabName = tabDefault;
    }
    status.set("tab name defined: " + tabName);

    status.set("checking if group");
    if (varType === "!G") {
      if (typeOptions.indexOf("v") !== -1) {
        const preCompLayers = findLayers(">> " + layerName + " <<", comp);
        const onOrOff = panel[camelCase(tabName)][camelCase(layerName)].visibilityToggle.value;

        (preCompLayers as Layer[]).forEach((item) => {
          item.enabled = onOrOff;
        });
      }
      return;
    }

    status.set("checking if color");
    if (varType === "!C") {
      const colorLayer = layer as AVLayer;
      //If a color layer, get color effects
      status.set("Looping through colors: " + tabName);
      const layerEffects = colorLayer("Effects") as PropertyGroup;
      for (let u = 1; u <= layerEffects.numProperties; u++) {
        status.set("Setting color #" + u);
        const nameData = layerEffects.property(u).name;
        layerField = panel[camelCase(tabName)][camelCase(nameData)];
        status.set("Setting color #" + u + ": " + layerField.txt.text);
        if (layerField.txt.text === "") continue;
        const colorProperty = (colorLayer.effect(nameData) as PropertyGroup)("Color") as Property | null;
        if (colorProperty) {
          colorProperty.setValue(colorize(layerField.txt.text));
        }
      }
      return;
    }

    layerField = panel[camelCase(tabName)][camelCase(layerName)];

    status.set("checking if text layer");
    if (varType === "!T") {
      // project.log("Set the text!");
      const thisText: string = layerField.txt.text;
      setText({ textLayer: layer as TextLayer, comp, newText: thisText, fontStyles, panel });
    }

    status.set("checking if media layer");
    if ((varType === "!I" || varType === "!V") && layerField.media.text !== "") {
      // project.log("Image or Video layers");
      const avLayer = layer as AVLayer;
      const orSize = {
          width: avLayer.width * (avLayer.scale.value[0] / 100),
          height: avLayer.height * (avLayer.scale.value[1] / 100),
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
          avLayer.transform.anchorPoint.value[0] / avLayer.width,
          avLayer.transform.anchorPoint.value[1] / avLayer.height,
        ];
      let innerComp = comp,
        heightOrWidth = "width",
        ratio;

      if (avLayer.containingComp !== comp) innerComp = avLayer.containingComp;

      avLayer.replaceSource(libItemsReg(regSafe(layerField.media.text), "Footage", 1) as AVItem, false);

      if (avLayer.width / avLayer.height <= orSize.width / orSize.height) {
        if (typeOptions.indexOf("f") == -1 && typeOptions.indexOf("b") == -1) {
          ratio = orSize.height / innerComp.height;
          heightOrWidth = "height";
        } else {
          ratio = orSize.width / innerComp.width;
        }
      } else {
        if (typeOptions.indexOf("f") !== -1 || typeOptions.indexOf("b") !== -1) {
          ratio = orSize.height / innerComp.height;
          heightOrWidth = "height";
        } else {
          ratio = orSize.width / innerComp.width;
        }
      }

      if (typeOptions.indexOf("n") !== -1) {
        avLayer.scale.setValue([100, 100, 100]);
      } else {
        avLayer.transform.scale.expression = imgExpression(ratio, heightOrWidth);
      }

      if (typeOptions.indexOf("s") !== -1 && avLayer.transform.scale.value[0] > 100) {
        avLayer.transform.scale.expressionEnabled = false;
        avLayer.scale.setValue([100, 100, 100]);
      }

      //If set to 'fill' (f), then put a mask around the original shape and fill it
      if (typeOptions.indexOf("f") !== -1) {
        // const newMask = (avLayer as AVLayer).Masks.addProperty("Mask"),
        const mask = (avLayer("Masks") as MaskPropertyGroup).addProperty("Mask");
        const maskShape = (mask.property("maskShape") as Property);
        const newShape = maskShape.value;
        // anch = avLayer.transform.anchorPoint.value,
        // pos = avLayer.position.value,
        const scale = avLayer.transform.scale.value;
        const bounds = [
          ((avLayer.width * scale[0] * 0.01 - orSize.width) * orPer[0]) / (scale[0] * 0.01),
          ((avLayer.height * scale[1] * 0.01 - orSize.height) * orPer[1]) / (scale[1] * 0.01),
          ((avLayer.width * scale[0] * 0.01 - orSize.width) * orPer[0]) / (scale[0] * 0.01) +
            orSize.width / (scale[0] / 100),
          ((avLayer.height * scale[1] * 0.01 - orSize.height) * orPer[1]) / (scale[1] * 0.01) +
            orSize.height / (scale[1] / 100),
        ];

        newShape.vertices = [
          [bounds[0], bounds[1]],
          [bounds[0], bounds[3]],
          [bounds[2], bounds[3]],
          [bounds[2], bounds[1]],
        ];
        newShape.closed = true;
        maskShape.setValue(newShape);
      }
    }

    status.set("checking if audio");
    // if (varType === "!A") {
    //   let testText = layerField;
    //   testText = testText.media ? testText.media : undefined;
    //   testText = testText.text ? testText.text : undefined;

    //   project.log(`!A: ${testText}`);
    // }
    if (varType === "!A" && layerField.media.text !== "") {
      const audioLayer = layer as AVLayer;
      audioLayer.replaceSource(libItemsReg(regSafe(layerField.media.text), "Footage", 1) as AVItem, false);
    }

    //Check to see if the layer needs to be turned on or off
    if (layerField.visibilityToggle !== undefined) layer.enabled = Boolean(layerField.visibilityToggle.value);

    return;
  }

  return;
}
