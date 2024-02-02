import camelCase from "just-camel-case";
import { findLayers, getPreComps, libItemsInFolder, libItemsReg, regSafe } from "../tools/ae";
import { addColorGroup, addMediaGroup, addTab, addTabbedPannel, addTextGroup } from "../uiGroupTemplates";
import { browserBtn, colorBtn } from "../tools/buttonFunctions";
import { decToRgb } from "../tools/colors";
import { fontStylesMaster, allEditableLayers } from "../globals/legacySupport";

export interface IId {
  name: string;
  id: number;
}

// POPULATE TEMPLATES MAIN FUNCTION (THIS CREATES THE TABS BUT DOES NOT FILL THEM)
// ====
export function populateTemplates(mainTab: TabbedPanel) {
  const templateFolder = libItemsReg(/templates/gi, "Folder") as FolderItem[];
  const templateFolders = [] as FolderItem[];
  const idArray: IId[] = [];

  for (let i = 0; i < templateFolder.length; i++) {
    checkFolder(templateFolder[i], idArray);
  }

  const folderArray = [] as { name: string, id: number }[];

  for (let u = 0; u < idArray.length; u++) {
    const folderObj = libItemsReg(idArray[u].id, "Folder", 1) as FolderItem;
    const compArr = libItemsInFolder(idArray[u].name, folderObj, "Composition") as CompItem[];

    if (compArr.length > 0 && findLayers(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, compArr[0]).length > 0) {
      templateFolders.push(folderObj);
    }
  }

  for (let i = 0; i < templateFolders.length; i++) {
    if (templateFolders[i].parentFolder.name === "User Comps") break;
    mainTab["t" + templateFolders[i].name + "_" + templateFolders[i].id] = mainTab.add(
      addTab("t" + templateFolders[i].name + "_" + templateFolders[i].id, templateFolders[i].name) as "tab"
    );
    folderArray.push({
      name: templateFolders[i].name,
      id: templateFolders[i].id,
    });
  }
  // Return a list of tab folders to use to create the layer fields
  return folderArray;
}

function checkFolder(folder: FolderItem, idArray: IId[]) {
  for (let i = 1; i <= folder.items.length; i++) {
    if (folder.items[i].typeName == "Composition" && folder.items[i].name === folder.name) {
      idArray.push({
        name: folder.name,
        id: folder.id,
      });
    }

    if (folder.items[i].typeName == "Folder") {
      checkFolder(folder.items[i] as FolderItem, idArray);
    }
  }
}

// POPULATE TABS MAIN FUNCTION (THIS INITIATES FIELD CREATION FOR THE EDITABLE LAYERS)
// ====
export function poplateTabs(templateName, mainTab) {
  const compFolder = libItemsReg(templateName.id, "Folder", 1) as FolderItem;
  const comp = libItemsInFolder(regSafe(templateName.name), compFolder, "Composition")[0] as CompItem;

  //Get all layers that are tagged as editable
  const editableLayers = findLayers(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, comp) as Layer[];

  //Get all compositions from any subfolder containing the word 'Precomps'
  const preComps = getPreComps(compFolder);

  //Get all layers in preComps that are tagged as editable and push them to the main array
  for (let i = 0; i < preComps.length; i++) {
    const editables = findLayers(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, preComps[i]);
    for (let u = 0; u < editables.length; u++) {
      editableLayers.push(editables[u]);
    }
  }

  allEditableLayers["t" + templateName.name + "_" + templateName.id] = editableLayers;

  //Set up a new tab for the template
  mainTab["t" + templateName.name + "_" + templateName.id]["content_" + templateName.name] = mainTab[
    "t" + templateName.name + "_" + templateName.id
  ].add(addTabbedPannel("content_" + templateName.name));

  //Create fields for each of the editable layers
  const tempTab = mainTab["t" + templateName.name + "_" + templateName.id]["content_" + templateName.name];
  loadTabs(editableLayers, tempTab, comp);
}

// LOAD TABS : THIS CREATES THE FIELDS FOR THE EDITABLE LAYERS
// ====
function loadTabs(arrayToLoad: Layer[], template, comp) {
  // Initialize font object
  fontStylesMaster[comp.id] = {};

  for (let i = 0; i < arrayToLoad.length; i++) {
    const typeMatches = /^![A-Z][a-z]*\(.*\)/.test(arrayToLoad[i].name)
      ? arrayToLoad[i].name.match(/^![A-Z][a-z]*\(.*\)/g)
      : arrayToLoad[i].name.match(/^![A-Z][a-z]*/g);
    const typeHeader = typeMatches[typeMatches.length - 1];
    const varType = typeHeader.match(/^![A-Z]/g)[0];
    const typeOptions = (typeHeader.match(/[a-z]/g) || []) as TypeOptions[];
    const terminalReg = new RegExp(regSafe(typeHeader), "g");
    const tabObj = {
      T: {
        tab: "Text Input",
        func: addTextGroup,
        inText: /!T/.test(varType)
          ? [regSafe((arrayToLoad[i] as TextLayer).text.sourceText.value.text), arrayToLoad[i].enabled]
          : ["", arrayToLoad[i].enabled],
      },
      I: { tab: "Image", func: addMediaGroup, inText: ["", arrayToLoad[i].enabled] },
      V: { tab: "Videos", func: addMediaGroup, inText: ["", arrayToLoad[i].enabled] },
      C: { tab: "Colors", func: addColorGroup, inText: "" },
      G: { tab: "Group" },
      F: {
        tab: "Fonts",
        func: addTextGroup,
        inText: [
          arrayToLoad[i].property("Source Text") !== null
            ? (arrayToLoad[i].property("Source Text") as Property).value.font
            : "",
          true,
        ],
      },
      A: { tab: "Audio", func: addMediaGroup, inText: ["", arrayToLoad[i].enabled] },
    };
    const tObj = tabObj[varType.replace("!", "")];
    const tabDefault = tObj.tab;

    //Check if tab is specified : if not, use type default tab

    let groupData = arrayToLoad[i].name.split(terminalReg)[1].replace(/(^\s*)|(\s*$)/g, "");
    const tabSpecified = /\[.+\]/g.test(groupData);
    let tabName: string;
    if (tabSpecified) {
      tabName = groupData.match(/\[.+\]/g)[0].replace(/[[\]]/g, "");
      groupData = groupData.replace(/\[.+\](\s)+/g, "");
    } else {
      tabName = tabDefault;
    }
    const tabID = camelCase(tabName);

    //Check if tab exists and create if not (and ignore if linked subtag)
    if (template[tabID] === undefined && typeOptions.indexOf("l") === -1)
      template[tabID] = template.add(addTab(tabID, tabName));

    if (varType === "!C") {
      //If a color layer, get color effects
      for (let u = 1; u <= (arrayToLoad[i]("Effects") as PropertyGroup).numProperties; u++) {
        const { name, matchName, enabled } = arrayToLoad[i]("Effects").property(u);
        if (matchName !== "ADBE Color Control" || !enabled) continue;

        template[tabID][camelCase(name)] = template[tabID].add(
          tObj.func(camelCase(name), name, "tab", decToRgb((arrayToLoad[i].effect(name)("Color") as Property).value))
        );

        // alert(template[tabID][camelCase(name)].picker);
        if (template[tabID][camelCase(name)] === undefined) {
          alert(`Problem creating color control for layer '${name}'. Skipping.`);
          continue;
        } else if (template[tabID][camelCase(name)].picker === undefined) {
          alert(`Picker doesn’t exist on color control for layer '${name}'. Skipping.
              If you are using a generic title like ‘Text’, this could cause problems as Adobe reserves \
   some of these words. You might try renaming the control to something more specific.`);

          // alert(Object.keys(template[tabID][camelCase(name)]).reducer((t, c) => t + ", " + c, ""));
          continue;
        }

        template[tabID][camelCase(name)].picker.onClick = function () {
          colorBtn(this);
        };
      }
      continue;
    }

    //If a group layer, do not generate fields
    if (varType === "!G") {
      if (typeOptions.indexOf("v") !== -1) {
        const layer = findLayers(">> " + groupData + " <<", comp);

        template[tabID][camelCase(groupData)] = template[tabID].add("checkbox", undefined, undefined, {
          name: "checkbox",
        });
        template[tabID][camelCase(groupData)].text = "Visible";
        template[tabID][camelCase(groupData)].value = layer[0].enabled;
      }
      continue;
    }

    if (varType === "!F") {
      groupData = groupData + " Style";
      fontStylesMaster[comp.id][camelCase(groupData)] = tabID;
    }

    if (varType === "!T") {
      //check for text style

      if (/\(.*\)/.test(typeHeader)) {
        const styleName = typeHeader.match(/\(.*\)/)[0].slice(1, -1);

        if (
          fontStylesMaster[comp.id][camelCase(styleName + " Style")] !== undefined &&
          template[fontStylesMaster[comp.id][camelCase(styleName + " Style")]][camelCase(styleName + " Style")].txt
            .text === ""
        ) {
          template[fontStylesMaster[comp.id][camelCase(styleName + " Style")]][
            camelCase(styleName + " Style")
          ].txt.text =
            arrayToLoad[i].property("Source Text") !== null
              ? (arrayToLoad[i].property("Source Text") as Property).value.font
              : "";
        }
      }
    }

    if (typeOptions.indexOf("l") === -1)
      template[tabID][camelCase(groupData)] = template[tabID].add(
        tObj.func(camelCase(groupData), groupData, "tab", tObj.inText, typeOptions)
      );

    if (varType === "!I" || varType === "!A" || varType === "!V") {
      //If an image layer, set up the browse button
      template[tabID][camelCase(groupData)].browse.onClick = function () {
        browserBtn(this);
      };
    }
  }
}
