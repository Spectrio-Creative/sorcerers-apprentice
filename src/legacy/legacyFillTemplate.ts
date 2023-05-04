import { camelCase } from "case-anything";
import { status } from "../globals/project/menu";
import { findLayers, getPreComps, libItemsReg, regSafe } from "../tools/ae";
import { arrIndex, customEach } from "../tools/legacyTools";
import { setText } from "./legacyTextFunctions";
import { RenderOp } from "../classes/Renderer";
import { imgExpression, sendtoRender } from "./legacyFunctionality";
import { colorize } from "../tools/colors";

export interface ITemplateOptions {
  comp: CompItem;
  compFolder: FolderItem;
  renderOp: RenderOp;
  fontStyles: { [key: string]: string };
  panel: TabbedPanel;
  outFile?: string;
}

export default function fillTemplate({ comp, compFolder, renderOp, panel, fontStyles, outFile }: ITemplateOptions) {
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
    replaceContent(layer);
  }

  // Find all text layers with expressions resize them
  // const textLayers = findLayers(/^!T/g, comp) as TextLayer[];



  sendtoRender(comp, renderOp, outFile);

  function replaceContent(layer: Layer) {
    status.text = "filling first layer";

    const typeMatches = /^![A-Z][a-z]*\(.*\)/.test(layer.name)
      ? layer.name.match(/^![A-Z][a-z]*\(.*\)/g)
      : layer.name.match(/^![A-Z][a-z]*/g);
    const typeHeader = typeMatches[typeMatches.length - 1];
    const varType: VarType = typeHeader.match(/^![A-Z]/g)[0] as VarType;

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

    let typeOptions: RegExpMatchArray | [] = typeHeader.match(/[a-z]/g);
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
        const preCompLayers = findLayers(">> " + layerName + " <<", comp);
        const onOrOff = panel[camelCase(tabName)][camelCase(layerName)].visibilityToggle.value;

        customEach(preCompLayers, function (item) {
          item.enabled = onOrOff;
        });
      }
      return;
    }

    status.text = "checking if color";
    if (varType === "!C") {
      const colorLayer = layer as AVLayer;
      //If a color layer, get color effects
      status.text = "Looping through colors: " + tabName;
      const layerEffects = (colorLayer("Effects") as PropertyGroup);
      for (let u = 1; u <= layerEffects.numProperties; u++) {
        status.text = "Setting color #" + u;
        const nameData = layerEffects.property(u).name;
        layerField = panel[camelCase(tabName)][camelCase(nameData)];
        status.text = "Setting color #" + u + ": " + layerField.txt.text;
        if (layerField.txt.text === "") continue;
        const colorProperty = (colorLayer.effect(nameData) as PropertyGroup)("Color") as Property | null;
        if (colorProperty) {
          colorProperty.setValue(colorize(layerField.txt.text));
        }
      }
      return;
    }

    layerField = panel[camelCase(tabName)][camelCase(layerName)];

    status.text = "checking if text layer";
    if (varType === "!T") {
      // project.log("Set the text!");
      const thisText: string = layerField.txt.text;
      setText({ textLayer: layer as TextLayer, comp, newText: thisText, fontStyles, panel });
    }

    status.text = "checking if media layer";
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
        avLayer.scale.setValue([100, 100, 100] as any);
      } else {
        avLayer.transform.scale.expression = imgExpression(ratio, heightOrWidth);
      }

      if (arrIndex(typeOptions, "s") !== -1 && avLayer.transform.scale.value[0] > 100) {
        avLayer.transform.scale.expressionEnabled = false;
        avLayer.scale.setValue([100, 100, 100] as any);
      }

      //If set to 'fill' (f), then put a mask around the original shape and fill it
      if (arrIndex(typeOptions, "f") !== -1) {
        const newMask = (avLayer as any).Masks.addProperty("Mask"),
          newMaskShape = newMask.property("maskShape"),
          newShape = newMaskShape.value,
          // anch = avLayer.transform.anchorPoint.value,
          // pos = avLayer.position.value,
          sca = avLayer.transform.scale.value,
          bounds = [
            ((avLayer.width * sca[0] * 0.01 - orSize.width) * orPer[0]) / (sca[0] * 0.01),
            ((avLayer.height * sca[1] * 0.01 - orSize.height) * orPer[1]) / (sca[1] * 0.01),
            ((avLayer.width * sca[0] * 0.01 - orSize.width) * orPer[0]) / (sca[0] * 0.01) +
              orSize.width / (sca[0] / 100),
            ((avLayer.height * sca[1] * 0.01 - orSize.height) * orPer[1]) / (sca[1] * 0.01) +
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
