import ui from "../src/uiGroupTemplates";
import { project } from "../src/globals/globals";
import { createSpreadsheetDialog } from "../src/spreadsheet/classes/SpreadsheetDialog";
import { sa_262_ii } from "../src/legacy/mdsRender";
import { camelCase } from "case-anything";
import { colorize, decToRgb, colorpicker } from "../src/tools/colors";
import { libItemsInFolder, findLayers, libItemsReg, regSafe, getPreComps } from "../src/tools/ae";
import {
  mds,
  compTitle,
  outFolder,
  template,
  compBtn,
  queueBtn,
  renderBtn,
  pbar,
  status,
} from "../src/globals/project/menu";
import { arrIndex } from "../src/tools/legacyTools";
import { fontStylesMaster, allEditableLayers } from "../src/globals/legacySupport";

function sa_262(collector = {}) {
  const addBrowseGroup = collector.addBrowseGroup || ui.addBrowseGroup,
    addColorGroup = collector.addColorGroup || ui.addColorGroup,
    //   addGroupV = collector.addGroupV || ui.addGroupV,
    addMediaGroup = collector.addMediaGroup || ui.addMediaGroup,
    addTab = collector.addTab || ui.addTab,
    addTabbedPannel = collector.addTabbedPannel || ui.addTabbedPannel,
    addTextGroup = collector.addTextGroup || ui.addTextGroup;

  // POPULATE THE TEMPLATE TAB WITH EDITABLE LAYERS
  // ====
  var fontStyles = {};
  var templateArray = populateTemplates(template);
  for (var i = 0; i < templateArray.length; i++) {
    poplateTabs(templateArray[i], template);
  }
  outFolder.browse.onClick = function () {
    browserBtn(this);
  };

  // GLOBAL VARIABLES
  // ====
  let idArray = [];

  // OPTION BUTTONS FUNCTIONALITY
  // ====
  compBtn.onClick = function () {
    project.log("At least do sooomething");
    compBtn.active = true;
    compBtn.active = false;
    if (pbar.value === 100) mds.close();
    sa_262_ii(template.selection, "compOnly");
  };

  queueBtn.onClick = function () {
    queueBtn.active = true;
    queueBtn.active = false;
    if (pbar.value === 100) {
      compBtn.text = "Create Comp";
      queueBtn.text = "Queue In AME";
      renderBtn.text = "Render In AME";
      pbar.value = 0;
      renderBtn.enabled = true;
    } else {
      sa_262_ii(template.selection, "queueOnly");
    }
  };

  renderBtn.onClick = function () {
    renderBtn.active = true;
    renderBtn.active = false;
    if (pbar.value === 100) {
      compBtn.text = "Create Comp";
      queueBtn.text = "Queue In AME";
      renderBtn.text = "Render In AME";
      pbar.value = 0;
    } else {
      sa_262_ii(template.selection, "renderAlso");
    }
  };

  // SHOW THE MENU
  // ====
  if (project.exportType === "Traditional") mds.show();

  if (project.exportType === "Spreadsheet") {
    const spreadsheetDialog = createSpreadsheetDialog(allEditableLayers);
    spreadsheetDialog.show();
  }

  // POPULATE TEMPLATES MAIN FUNCTION (THIS CREATES THE TABS BUT DOES NOT FILL THEM)
  // ====
  function populateTemplates(mainTab) {
    var templateFolder = libItemsReg(/templates/gi, "Folder");
    var templateFolders = [];
    idArray = [];

    for (var i = 0; i < templateFolder.length; i++) {
      checkFolder(templateFolder[i]);
    }

    var folderArray = [];

    for (var u = 0; u < idArray.length; u++) {
      var folderObj = libItemsReg(idArray[u].id, "Folder", 1),
        compArr = libItemsInFolder(idArray[u].name, folderObj, "Composition");

      if (compArr.length > 0 && findLayers(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, compArr[0]).length > 0) {
        templateFolders.push(folderObj);
      }
    }

    for (var i = 0; i < templateFolders.length; i++) {
      if (templateFolders[i].parentFolder.name === "User Comps") break;
      mainTab["t" + templateFolders[i].name + "_" + templateFolders[i].id] = mainTab.add(
        addTab("t" + templateFolders[i].name + "_" + templateFolders[i].id, templateFolders[i].name)
      );
      folderArray.push({
        name: templateFolders[i].name,
        id: templateFolders[i].id,
      });
    }
    // Return a list of tab folders to use to create the layer fields
    return folderArray;
  }

  function checkFolder(folder) {
    for (var i = 1; i <= folder.items.length; i++) {
      if (folder.items[i].typeName == "Composition" && folder.items[i].name === folder.name) {
        idArray.push({
          name: folder.name,
          id: folder.id,
        });
      }

      if (folder.items[i].typeName == "Folder") {
        checkFolder(folder.items[i]);
      }
    }
  }

  // POPULATE TABS MAIN FUNCTION (THIS INITIATES FIELD CREATION FOR THE EDITABLE LAYERS)
  // ====
  function poplateTabs(templateName, mainTab) {
    var compFolder = libItemsReg(templateName.id, "Folder", 1);
    var comp = libItemsInFolder(regSafe(templateName.name), compFolder, "Composition")[0];

    //Get all layers that are tagged as editable
    var editableLayers = findLayers(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, comp);

    //Get all compositions from any subfolder containing the word 'Precomps'
    var preComps = getPreComps(compFolder);

    //Get all layers in preComps that are tagged as editable and push them to the main array
    for (var i = 0; i < preComps.length; i++) {
      var editables = findLayers(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, preComps[i]);
      for (var u = 0; u < editables.length; u++) {
        editableLayers.push(editables[u]);
      }
    }

    allEditableLayers["t" + templateName.name + "_" + templateName.id] = editableLayers;

    //Set up a new tab for the template
    mainTab["t" + templateName.name + "_" + templateName.id]["content_" + templateName.name] =
      mainTab["t" + templateName.name + "_" + templateName.id].add(
        addTabbedPannel("content_" + templateName.name)
      );

    //Create fields for each of the editable layers
    var tempTab =
      mainTab["t" + templateName.name + "_" + templateName.id]["content_" + templateName.name];
    loadTabs(editableLayers, tempTab, comp);
  }

  // LOAD TABS : THIS CREATES THE FIELDS FOR THE EDITABLE LAYERS
  // ====
  function loadTabs(arrayToLoad, template, comp) {
    // Initialize font object
    fontStylesMaster[comp.id] = {};

    for (var i = 0; i < arrayToLoad.length; i++) {
      var typeMatches = /^![A-Z][a-z]*\(.*\)/.test(arrayToLoad[i].name)
          ? arrayToLoad[i].name.match(/^![A-Z][a-z]*\(.*\)/g)
          : arrayToLoad[i].name.match(/^![A-Z][a-z]*/g),
        typeHeader = typeMatches[typeMatches.length - 1],
        varType = typeHeader.match(/^![A-Z]/g)[0],
        typeOptions = typeHeader.match(/[a-z]/g),
        terminalReg = new RegExp(regSafe(typeHeader), "g"),
        tabObj = {
          T: {
            tab: "Text Input",
            func: addTextGroup,
            inText: /!T/.test(varType)
              ? [regSafe(arrayToLoad[i].text.sourceText.value.text), arrayToLoad[i].enabled]
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
                ? arrayToLoad[i].property("Source Text").value.font
                : "",
              true,
            ],
          },
          A: { tab: "Audio", func: addMediaGroup, inText: ["", arrayToLoad[i].enabled] },
        },
        tObj = tabObj[varType.replace("!", "")],
        tabDefault = tObj.tab;

      var groupData = arrayToLoad[i].name.split(terminalReg)[1].replace(/(^\s*)|(\s*$)/g, "");
      var tabName = /\[.+\]/g.test(groupData);

      //Check if tab is specified : if not, use type default tab
      if (tabName) {
        tabName = groupData.match(/\[.+\]/g)[0].replace(/[\[\]]/g, "");
        groupData = groupData.replace(/\[.+\](\s)+/g, "");
      } else {
        tabName = tabDefault;
      }
      var tabID = camelCase(tabName);

      //Check if tab exists and create if not (and ignore if linked subtag)
      if (template[tabID] === undefined && arrIndex(typeOptions, "l") === -1)
        template[tabID] = template.add(addTab(tabID, tabName));

      if (varType === "!C") {
        //If a color layer, get color effects
        for (var u = 1; u <= arrayToLoad[i]("Effects").numProperties; u++) {
          const { name, matchName, enabled } = arrayToLoad[i]("Effects").property(u);
          if (matchName !== "ADBE Color Control" || !enabled) continue;

          template[tabID][camelCase(name)] = template[tabID].add(
            tObj.func(
              camelCase(name),
              name,
              "tab",
              decToRgb(arrayToLoad[i].effect(name)("Color").value)
            )
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
        if (arrIndex(typeOptions, "v") !== -1) {
          var layer = findLayers(">> " + groupData + " <<", comp);

          template[tabID][camelCase(groupData)] = template[tabID].add(
            "checkbox",
            undefined,
            undefined,
            { name: "checkbox" }
          );
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
          var styleName = typeHeader.match(/\(.*\)/)[0].slice(1, -1);

          if (
            fontStylesMaster[comp.id][camelCase(styleName + " Style")] !== undefined &&
            template[fontStylesMaster[comp.id][camelCase(styleName + " Style")]][
              camelCase(styleName + " Style")
            ].txt.text === ""
          ) {
            template[fontStylesMaster[comp.id][camelCase(styleName + " Style")]][
              camelCase(styleName + " Style")
            ].txt.text =
              arrayToLoad[i].property("Source Text") !== null
                ? arrayToLoad[i].property("Source Text").value.font
                : "";
          }
        }
      }

      if (arrIndex(typeOptions, "l") === -1)
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

  // COLOR BUTTON SETUP
  // ====
  function colorBtn(inputFld) {
    inputFld.parent.txt.text = decToRgb(colorpicker(colorize(inputFld.parent.txt.text)));
  }

  // BROWSER BUTTON SETUP - ALL FILES EXCEPT THE OUTPUT FOLDER
  // ====
  function browserBtn(inputFld) {
    var file = new File("NewFile.mp4");
    var slash = $.os.indexOf("Windows") !== -1 ? "\\" : "/";
    var name = compTitle.txt.text !== "" ? compTitle.txt.text : "videoID";
    file.changePath(app.project.file.parent.fsName + slash + name);

    status.text = inputFld.parent.name;

    var textLocation = "img";
    if (inputFld.parent.txt !== undefined) {
      textLocation = "txt";
    } else if (inputFld.parent.audio !== undefined) {
      textLocation = "audio";
    }

    var defaultFolder = inputFld.parent[textLocation].text;
    if ($.os.indexOf("Windows") !== -1)
      // On Windows, escape backslashes first
      defaultFolder = defaultFolder.replace("\\", "\\\\");

    var fileF;
    if (inputFld.parent.name === "outFolder") {
      /*var folder = new Folder(file.parent);
        //fileF = folder.execute();*/
      fileF = file.saveDlg();
    } else {
      fileF = File.openDialog(inputFld.parent.name, false);
    }

    if (fileF !== null) inputFld.parent[textLocation].text = fileF.fsName;
  }

  function copyObj(src) {
    var target = {};
    for (var prop in src) {
      if (src.hasOwnProperty(prop)) {
        if (prop === "parent" || prop === "children" || prop === "window") {
          //            if(prop === 'parent' || prop === 'window'){
          //                alert("WHOOP");
          continue;
        }
        //            alert(prop);

        // if the value is a nested object, recursively copy all it's properties
        if (typeof src[prop] === "object") {
          try {
            target[prop] = copyObj(src[prop]);
          } catch (error) {
            target[prop] = src[prop];
          }
        } else {
          target[prop] = src[prop];
        }
      }
    }

    return target;
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////   FILLING FUNCTIONALITY   //////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
}

export default sa_262;
