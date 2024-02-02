// SEARCH IN FOLDER FOR ITEM
// ====
export function libItemsInFolder(reg: RegExp | string | number, folderObj: FolderItem, iType) {
  const resultsArr: _ItemClasses[] = [];

  //Ensure that reg is a regular expression
  if (typeof reg === "string" || typeof reg === "number") {
    reg = new RegExp(`${reg}`, "g");
  }

  for (let i = 1; i <= folderObj.items.length; i++) {
    if (reg.test(folderObj.items[i].name)) {
      if (iType === undefined || iType === folderObj.items[i].typeName) {
        resultsArr.push(folderObj.items[i]);
      }
    }
  }
  return resultsArr;
}

// SEARCH IN FOLDER FOR ITEM
// ====
export function libItemsInFolderRec(reg: RegExp | string | number, folderObj, iType) {
  let resultsArr = [];

  //Ensure that reg is a regular expression
  if (typeof reg === "string" || typeof reg === "number") {
    reg = new RegExp(`${reg}`, "g");
  }

  for (let i = 1; i <= folderObj.items.length; i++) {
    if (iType !== "Folder" && folderObj.items[i].typeName === "Folder") {
      resultsArr = resultsArr.concat(libItemsInFolderRec(reg, folderObj.items[i], iType));
    }

    if (reg.test(folderObj.items[i].name)) {
      if (iType === undefined || iType === folderObj.items[i].typeName) {
        resultsArr.push(folderObj.items[i]);
      }
    }
  }
  return resultsArr;
}

// GET PRECOMPS : THIS RETURNS ALL THE COMPS IN THE PRECOMP SUBFOLDER
// ====
export function getPreComps(folder: FolderItem): CompItem[] {
  const preCompFolder = libItemsInFolder(/Precomps/g, folder, "Folder")[0];

  if (preCompFolder == undefined) return [];
  return libItemsInFolderRec(/[\s\S]+/g, preCompFolder, "Composition");
}

// FIND LAYER IN COMP
// ====
export function findLayers(reg: RegExp | string | number, compObj: CompItem, maxResult = Number.POSITIVE_INFINITY) {
  //Ensure that reg is a regular expression
  if (typeof reg === "string" || typeof reg === "number") {
    reg = new RegExp(`${reg}`, "g");
  }
  const layerArr: Layer[] = [];
  for (let i = 1; i <= compObj.layers.length; i++) {
    if (reg.test(compObj.layers[i].name)) {
      if (maxResult === 1) return compObj.layers[i];
      layerArr.push(compObj.layers[i]);
      if (layerArr.length === maxResult) break;
    }
  }
  return layerArr;
}

// REGSAFE - escapes all special characters
export function regSafe(regExString: string): string {
  if (/^\d+$/.test(regExString)) {
    return regExString;
  }
  return String(regExString).replace(/[^\w \t\f]|[\n\r]/g, function (match) {
    return "\\" + match;
  });
}

// FIND LIBRARY ITEMS BY NAME OR REGEX
// iType = the desired file type
// maxResult = the maximum results in the array. If 1, the object is returned instead of an array
// ====
export function libItemsReg(reg: RegExp | string | number, iType?: string, maxResult = Number.POSITIVE_INFINITY) {
  let searcher = "name";

  if (typeof reg === "number") {
    searcher = "id";
  }
  //Ensure that reg is a regular expression
  if (typeof reg === "string" || typeof reg === "number") {
    reg = new RegExp(`${reg}`, "g");
  }
  const resultsArr: _ItemClasses[] = [];

  for (let i = 1; i <= app.project.items.length; i++) {
    if (reg.test(app.project.items[i][searcher])) {
      if (iType === undefined || iType === app.project.items[i].typeName) {
        if (maxResult === 1) return app.project.items[i];
        resultsArr.push(app.project.items[i]);
        if (resultsArr.length === maxResult) break;
      }
    }
  }
  return resultsArr;
}

// export function relinkExp(layer: Layer, compItem: CompItem) {
//   for (let i = 1; i <= (layer.property("Effects") as PropertyGroup).numProperties; i++) {
//     const matchName = layer.property("Effects").property(i).matchName;

//     if (matchName == "ADBE Fill" || matchName == "ADBE Color Control") {
//       const colorProperty: Property = layer.property("Effects").property(i).property("Color") as Property;
//       if (colorProperty.expressionEnabled) {
//         const orExp = colorProperty.expression,
//           expressionComp = (orExp.match(/comp\(".*?"\)/) || [""])[0].slice(6, -2);
//         let newExp = orExp;

//         const exReg = new RegExp(regSafe(expressionComp), "g");
//         if (expressionComp === ORcomp.name) {
//           newExp = orExp.replace(exReg, comp.name);
//         } else {
//           customEach(preComps, function (item: CompItem) {
//             if (expressionComp === item.name) {
//               item.name = "[" + comp.name + "] " + item.name;
//               newExp = orExp.replace(exReg, item.name);
//             } else if (expressionComp === item.name.replace("[" + comp.name + "] ", "")) {
//               newExp = orExp.replace(exReg, item.name);
//             }
//           });
//         }

//         (layer.property("Effects").property(i).property("Color") as Property).expression = newExp;
//       }
//     }
//   }

//   if (
//     layer instanceof TextLayer &&
//     layer.property("Source Text") !== undefined &&
//     (layer.property("Source Text") as Property).expressionEnabled
//   ) {
//     const orExp = (layer.property("Source Text") as Property).expression,
//       expressionComp = orExp.match(/comp\(".*?"\)/)[0].slice(6, -2);
//     let newExp = orExp;

//     if (expressionComp === ORcomp.name) {
//       const orReg = new RegExp(regSafe(ORcomp.name), "g");
//       newExp = orExp.replace(orReg, comp.name);
//     } else {
//       customEach(preComps, function (item) {
//         if (expressionComp === item.name) {
//           item.name = "[" + comp.name + "] " + item.name;
//           newExp = orExp.replace(expressionComp, item.name);
//         } else if (expressionComp === item.name.replace("[" + comp.name + "] ", "")) {
//           newExp = orExp.replace(expressionComp, item.name);
//         }
//       });
//     }

//     (layer.property("Source Text") as Property).expression = newExp;

//     const textValue = layer.text.sourceText.valueAtTime(0, false);

//     layer.text.sourceText.expressionEnabled = false;
//     setText(layer, compItem, textValue);
//     layer.text.sourceText.expressionEnabled = true;
//   }
// }
