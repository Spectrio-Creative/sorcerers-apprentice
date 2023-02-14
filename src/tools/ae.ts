// SEARCH IN FOLDER FOR ITEM
// ====
function libItemsInFolder(reg, folderObj, iType) {
  var resultsArr = [];

  //Ensure that reg is a regular expression
  if (typeof reg === "string" || typeof reg === "number") {
    reg = new RegExp(reg, "g");
  }

  for (var i = 1; i <= folderObj.items.length; i++) {
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
function libItemsInFolderRec(reg, folderObj, iType) {
  var resultsArr = [];

  //Ensure that reg is a regular expression
  if (typeof reg === "string" || typeof reg === "number") {
    reg = new RegExp(reg, "g");
  }

  for (var i = 1; i <= folderObj.items.length; i++) {
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
function getPreComps(folder) {
  var preCompFolder = libItemsInFolder(/Precomps/g, folder, "Folder")[0];

  if (preCompFolder == undefined) return [];
  return libItemsInFolderRec(/[\s\S]+/g, preCompFolder, "Composition");
}

// FIND LAYER IN COMP
// ====
function findLayers(reg, compObj, maxResult) {
  //Ensure that reg is a regular expression
  if (typeof reg === "string" || typeof reg === "number") {
    reg = new RegExp(reg, "g");
  }
  var layerArr = [];
  for (var i = 1; i <= compObj.layers.length; i++) {
    if (reg.test(compObj.layers[i].name)) {
      if (maxResult === 1) return compObj.layers[i];
      layerArr.push(compObj.layers[i]);
      if (layerArr.length === maxResult) break;
    }
  }
  return layerArr;
}

// REGSAFE - escapes all special characters
function regSafe(newString) {
  if (/^\d+$/.test(newString)) {
    return Number(newString);
  }
  return String(newString).replace(/[^\w \t\f]|[\n\r]/g, function (match) {
    return "\\" + match;
  });
}

// FIND LIBRARY ITEMS BY NAME OR REGEX
// iType = the desired file type
// maxResult = the maximum results in the array. If 1, the object is returned instead of an array
// ====
function libItemsReg(reg, iType, maxResult) {
  var searcher = "name";

  if (typeof reg === "number") {
    searcher = "id";
  }
  //Ensure that reg is a regular expression
  if (typeof reg === "string" || typeof reg === "number") {
    reg = new RegExp(reg, "g");
  }
  var resultsArr = [];

  for (var i = 1; i <= app.project.items.length; i++) {
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

export { libItemsInFolder, libItemsInFolderRec, findLayers, libItemsReg, regSafe, getPreComps };
