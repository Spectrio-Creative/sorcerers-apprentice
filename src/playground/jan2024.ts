import { findLayers } from "../tools/ae";
import { colorize } from "../tools/colors";

export function jan2024() {
  // include(../node_modules/xlsx/dist/xlsx.extendscript.js);
  const comp = app.project.activeItem as CompItem;
  const layers = findLayers(/^!T|^!I|^!V|^!C|^!G|^!A/g, comp) as Layer[];

  layers.forEach((layer) => {
    const varType = layer.name.match(/^![A-Z]/g)[0] as VarType;

    if (varType === "!C") {
      const colorLayer = layer as AVLayer;
      //If a color layer, get color effects
      // status.set("Looping through colors: " + tabName);
      const layerEffects = colorLayer("Effects") as PropertyGroup;
      for (let u = 1; u <= layerEffects.numProperties; u++) {
        //   status.set("Setting color #" + u);
        const nameData = layerEffects.property(u).name;
        //   layerField = imageList[camelCase(tabName)][camelCase(nameData)];
        //   status.set("Setting color #" + u + ": " + layerField.txt.text);
        //   if (layerField.txt.text === "") continue;
        const colorProperty = (colorLayer.effect(nameData) as PropertyGroup)("Color") as Property | null;
        if (colorProperty) {
          colorProperty.setValue(colorize("255, 0, 0"));
        }
      }
      return;
    }

    //   const typeMatches = /^![A-Z][a-z]*\(.*\)/.test(layer.name)
    //     ? layer.name.match(/^![A-Z][a-z]*\(.*\)/g)
    //     : layer.name.match(/^![A-Z][a-z]*/g);
    //   const typeHeader = typeMatches[typeMatches.length - 1];
    //   const type = typeHeader.match(/^![A-Z][a-z]*/g)[0];
    //   const terminalReg = new RegExp(regSafe(typeHeader), "g");
    //   const tabObj = {
    //     T: "Text Input",
    //     I: "Image",
    //     V: "Video",
    //     C: "Colors",
    //     G: "Group",
    //     F: "Font Style",
    //     A: "Audio",
    //   };
    //   const tabDefault = tabObj[type.replace("!", "")];

    //   let typeOptions: RegExpMatchArray | [] = typeHeader.match(/[a-z]/g);
    //   let layerField;

    //   if (typeOptions.indexOf("l") !== -1 || type === "!F") return;

    //   if (typeOptions == null || typeOptions == undefined) typeOptions = [];

    //   let layerName: string = layer.name.split(terminalReg)[1].replace(/(^\s*)|(\s*$)/g, "");
    //   const hasTabName: boolean = /\[.+\]/g.test(layerName);
    //   let tabName = "";

    //   //Check if tab is specified : if not, use type default tab
    //   if (hasTabName) {
    //     tabName = layerName.match(/\[.+\]/g)[0].replace(/[[\]]/g, "");
    //     layerName = layerName.replace(/\[.+\](\s)+/g, "");
    //   } else {
    //     tabName = tabDefault;
    //   }
  });

  // XLSX.readFile(excel.fsName);
}
