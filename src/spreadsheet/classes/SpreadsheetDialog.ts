import { snakeCase, spaceCase } from "case-anything";
import stringify from "fast-safe-stringify";
import get from "just-safe-get";
import set from "just-safe-set";
// import otherStringify from "json-stringify-safe";
import { createLayer } from "../../classes/Layer";
// import { createTemplateLayer } from '../../classes/template/TemplateLayer';
import { project } from "../../globals/globals";
import { compTitle, status, template } from "../../globals/project/menu";
import { sa_262_ii } from "../../legacy/mdsRender";
import { getFilePaths, mapMenu } from "../../tools/dialog/template";
import { parseTabTitle, parseTemplateTitle } from "../../tools/library/sorcererDictionary";
import { showSpreadSheetInfo } from "../info";
import { createSpreadsheet } from "./Spreadsheet";

const createSpreadsheetDialog = (exportables) => {
  return {
    canceled: false,
    success: false,
    canExport: false,
    exportType: "Traditional",
    location: "~/",
    exportables: exportables || {},
    spreadsheet: null,
    menuMap: mapMenu(template),
    substatusStatus: false,
    singleCSV: false,
    renderOp: "aeQueueOnly",
    renderOpOptionsn: ["aeQueueOnly", "queueOnly", "compOnly", "renderAlso"],

    checkLocation: function (location) {
      const result = location !== null;
      this.location = location || this.location;
      return result;
    },

    iterateExportables: function (onEach) {
      Object.entries(this.exportables).forEach(onEach);
    },

    printCSVs: function () {
      const csv = [];
      const templates = Object.keys(this.menuMap);
      const allPaths = getFilePaths(this.menuMap);

      const prefix = (app.project.file) ? spaceCase((app.project.file.name).replace(".aep", "")) + " " : "";

      const chooseLocation = project.addLocation("demo_csvs", "Choose folder for CSVs");
      if(!chooseLocation) return;

      if(this.singleCSV) {
        csv[0] = ["Template", "Comp Title", "Output File"];
        
        templates.forEach((temp, i) => {
          const index = i + 1;
          csv[index] = [];
          
          const tempTitle = (parseTabTitle(temp) || { title: temp }).title;
          csv[index].push(tempTitle, tempTitle, "~/");
  
          const paths = allPaths.filter((path) => path.includes(temp));
          paths.forEach((path) => {
            const pathParts = path.split(".");
            if (pathParts.length < 4) return;
            const [_tempName, _content, group, title] = pathParts;

            let capTitle = spaceCase(title);
            capTitle = capTitle.charAt(0).toUpperCase() + capTitle.slice(1);
            const val = get(template, `${path}.text`);

            let columnIndex = csv[0].indexOf(`"[${group}] ${capTitle}"`);
            if(columnIndex === -1) {
              columnIndex = csv[0].length;
              csv[0].push(`"[${group}] ${capTitle}"`);
            }
            csv[index][columnIndex] = (`"${val}"`);
          });
        });
        const csvString = csv.reducer(
          (t, c) => t + c.reducer((it, ic) => it + "," + (ic || "")) + "\n",
          ""
        );
        project.addFileFromString(csvString, `${snakeCase(prefix)}.csv`, "demo_csvs");
        alert("Template csv exported!");
      } else {
        templates.forEach((temp, i) => {
          project.log(temp);
          const tempTitle = (parseTabTitle(temp) || { title: temp }).title;
          csv[i] = [["Template"], [tempTitle]];
  
          csv[i][0].push("Comp Title", "Output File");
          csv[i][1].push(tempTitle, "~/");
  
          const paths = allPaths.filter((path) => path.includes(temp));
          paths.forEach((path) => {
            project.log(path);
            const pathParts = path.split(".");
            project.log(pathParts.length);
            if (pathParts.length < 4) return;
            const [_tempName, _content, group, title] = pathParts;
            // spaceCase()
            let capTitle = spaceCase(title);
            capTitle = capTitle.charAt(0).toUpperCase() + capTitle.slice(1);
            const val = get(template, `${path}.text`);
  
            csv[i][0].push(`"[${group}] ${capTitle}"`);
            csv[i][1].push(`"${val}"`);
          });
          const csvString = csv[i].reducer(
            (t, c) => t + c.reducer((it, ic) => it + "," + ic) + "\n",
            ""
          );
          project.log(stringify(csv, undefined, undefined, { depthLimit: 3 }));
          project.log(`Exported test_csv_${i + 1}.csv`);
          project.addFileFromString(csvString, `${snakeCase(prefix + tempTitle)}.csv`, "demo_csvs");
        });
        alert(`${templates.length} template csv(s) exported!`);
      }
    },

    printCSVs_legacy: function () {
      project.log("Did something!");
      const csv = [];
      this.iterateExportables(([key, value], i) => {
        csv[i] = [["Template"], [key]];

        value.forEach((layer) => {
          const layerClass = createLayer(layer);
          if (!layer.templateDetails || layer.templateDetails.type === "Group") return;

          const title = (parseTemplateTitle(layerClass.name) || { title: layerClass.name }).title;

          csv[i][0].push(title);
          csv[i][1].push(layerClass.csvPlaceholder());
          // project.log(layer.name);
        });
        project.log(stringify(csv, undefined, undefined, { depthLimit: 3 }));
        const csvString = csv[i].reducer(
          (t, c) => t + c.reducer((it, ic) => it + "," + ic) + "\n",
          ""
        );
        project.log(`Exported test_csv_${i + 1}.csv`);
        project.addFileFromString(csvString, `test_csv_${i + 1}.csv`);
      });
    },

    show: function () {
      project.log(stringify(this.menuMap));

      /*
      Code for Import https://scriptui.joonas.me — (Triple click to select): 
      {"activeId":72,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"text":"The Sorcerer’s Apprentice","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"],"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"enabled":true}},"item-19":{"id":19,"type":"Group","parentId":0,"style":{"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null,"varName":null,"enabled":true}},"item-36":{"id":36,"type":"Group","parentId":0,"style":{"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["center","top"],"alignment":null,"varName":"finished","enabled":true}},"item-37":{"id":37,"type":"Button","parentId":36,"style":{"text":"DONE","justify":"center","preferredSize":[0,0],"alignment":null,"varName":"done","helpTip":null,"enabled":true}},"item-45":{"id":45,"type":"Panel","parentId":19,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Spreadsheet Export","preferredSize":[360,0],"margins":[15,20,10,20],"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-52":{"id":52,"type":"Group","parentId":45,"style":{"enabled":true,"varName":"exportModeGroup","preferredSize":[0,0],"margins":[0,0,10,0],"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-54":{"id":54,"type":"StaticText","parentId":52,"style":{"enabled":true,"varName":"exportModeText","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"CSV:","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-60":{"id":60,"type":"Button","parentId":36,"style":{"enabled":true,"varName":"createCSV","text":"CREATE CSV(S)","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-62":{"id":62,"type":"EditText","parentId":52,"style":{"enabled":false,"varName":"filePath","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"","justify":"left","preferredSize":[190,0],"alignment":null,"helpTip":null}},"item-63":{"id":63,"type":"Button","parentId":52,"style":{"enabled":true,"varName":null,"text":"Select","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-66":{"id":66,"type":"Progressbar","parentId":45,"style":{"enabled":true,"varName":null,"preferredSize":[358,4],"alignment":null,"helpTip":null}},"item-67":{"id":67,"type":"StaticText","parentId":45,"style":{"enabled":true,"varName":"status","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Select a spreadsheet and press 'Go' to process!","justify":"left","preferredSize":[301,18],"alignment":null,"helpTip":null}},"item-68":{"id":68,"type":"Button","parentId":52,"style":{"enabled":true,"varName":"process","text":"Go","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-69":{"id":69,"type":"Checkbox","parentId":71,"style":{"enabled":true,"varName":"singleCsv","text":"Single CSV*","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-70":{"id":70,"type":"Checkbox","parentId":71,"style":{"enabled":true,"varName":"renderQ","text":"Add to Render Queue","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-71":{"id":71,"type":"Group","parentId":45,"style":{"enabled":true,"varName":"additionalOptions","preferredSize":[0,0],"margins":[0,0,10,0],"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-72":{"id":72,"type":"Button","parentId":36,"style":{"enabled":true,"varName":"info","text":"Info (*)","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,19,45,52,54,62,63,68,71,69,70,66,67,36,72,60,37],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"functionWrapper":false,"compactCode":false,"showDialog":true,"afterEffectsDockable":false,"itemReferenceList":"None"}}
      */ 

      // DIALOG
      // ======
      var dialog = new Window("dialog");
      dialog.text = "The Sorcerer’s Apprentice";
      dialog.orientation = "column";
      dialog.alignChildren = ["center", "top"];
      dialog.spacing = 10;
      dialog.margins = 16;

      // GROUP1
      // ======
      var group1 = dialog.add("group", undefined, { name: "group1" });
      group1.orientation = "column";
      group1.alignChildren = ["left", "top"];
      group1.spacing = 10;
      group1.margins = 0;

      // PANEL1
      // ======
      var panel1 = group1.add("panel", undefined, undefined, { name: "panel1" });
      panel1.text = "Spreadsheet Export";
      panel1.preferredSize.width = 360;
      panel1.orientation = "column";
      panel1.alignChildren = ["left", "top"];
      panel1.spacing = 10;
      panel1.margins = [20, 15, 20, 10];

      // EXPORTMODEGROUP
      // ===============
      var exportModeGroup = panel1.add("group", undefined, { name: "exportModeGroup" });
      exportModeGroup.orientation = "row";
      exportModeGroup.alignChildren = ["left", "center"];
      exportModeGroup.spacing = 10;
      exportModeGroup.margins = [0, 0, 0, 0];

      var exportModeText = exportModeGroup.add("statictext", undefined, undefined, {
        name: "exportModeText",
      });
      exportModeText.text = "CSV:";

      var filePath = exportModeGroup.add("edittext {properties: {name: \"filePath\"}}");
      // filePath.enabled = false;
      filePath.text = this.location;
      filePath.preferredSize.width = 190;

      var button1 = exportModeGroup.add("button", undefined, undefined, { name: "button1" });
      button1.text = "Select";
      button1.onClick = () => {
        this.spreadsheet = createSpreadsheet();
        if (this.spreadsheet) {
          this.spreadsheet.logSheet(`Loaded spreadsheet: ${this.spreadsheet.file.name}`);
          filePath.text = this.spreadsheet.file.fsName;
          this.progressbar1.value = 0;
        }
        // if(this.spreadsheet) filePath.text = this.spreadsheet.file.fsName;
      };

      var process = exportModeGroup.add("button", undefined, undefined, { name: "process" });
      process.text = "Go";
      process.onClick = () => {
        this.processSheet();
      };

      // ADDITIONALOPTIONS
      // =================
      var additionalOptions = panel1.add("group", undefined, {name: "additionalOptions"}); 
      additionalOptions.orientation = "row"; 
      additionalOptions.alignChildren = ["left","center"]; 
      additionalOptions.spacing = 10; 
      additionalOptions.margins = [0,0,0,10]; 

      var singleCsv = additionalOptions.add("checkbox", undefined, undefined, {name: "singleCsv"}); 
      singleCsv.text = "Single CSV*";
      singleCsv.value = false;
      singleCsv.onClick = () => {
        this.singleCSV = singleCsv.value;
      };

      var renderQ = additionalOptions.add("checkbox", undefined, undefined, {name: "renderQ"}); 
      renderQ.text = "Add to Render Queue";
      renderQ.value = true;
      renderQ.onClick = () => {
        this.renderOp = renderQ.value ? "aeQueueOnly" : "compOnly";
      };

      // PANEL1
      // ======
      this.progressbar1 = panel1.add("progressbar", undefined, undefined, { name: "progressbar1" });
      this.progressbar1.maxvalue = 100;
      this.progressbar1.value = 0;
      this.progressbar1.preferredSize.width = 368;
      this.progressbar1.preferredSize.height = 4;

      this.status = panel1.add("statictext", undefined, undefined, { name: "status" });
      this.status.text = "Select a csv and press 'Go'! Or 'Create CSV(s)' to produce csvs from your templates";
      this.status.preferredSize.height = 18;
      status.preferredSize.width = 368;

      // this.substatus = panel1.add("statictext", undefined, undefined, { name: "substatus" });
      // this.substatus.text = "---------------------------------------------------------";
      // this.substatus.preferredSize.height = 18;
      // status.preferredSize.width = 368;
      // this.status.graphics.font = ScriptUI.newFont("Arial", ScriptUI.FontStyle.BOLD, 8);

      // FINISHED
      // ========
      var finished = dialog.add("group", undefined, { name: "finished" });
      finished.orientation = "row";
      finished.alignChildren = ["center", "top"];
      finished.spacing = 10;
      finished.margins = 0;

      var done = finished.add("button", undefined, undefined, { name: "done" });
      done.onClick = () => {
        dialog.close();
      };
      done.text = "DONE";

      var createCSV = finished.add("button", undefined, undefined, { name: "createCSV" });
      createCSV.text = "CREATE CSV(S)";
      createCSV.onClick = () => {
        this.printCSVs();
      };

      var info = finished.add("button", undefined, undefined, {name: "info"}); 
      info.text = "Info (*)"; 
      info.onClick = () => {
        showSpreadSheetInfo();
      };

      dialog.show();
    },

    parseCategoryTitle: function (input) {
      if (typeof input !== "string") return;
      const matcher = /(?:![A-Z][a-z]*\W*(?:\([\w ]+\))?\W)?(?:\[(.*)\])?\W*(.*)/;
      // const matcher = /(?:\[(.*)\])?\W*(.+)/;
      const [_total, group, title] = input.match(matcher);
      return { input, group, title };
    },

    processSheet: function () {
      if (!this.spreadsheet) {
        alert("First select a spreadsheet!");
        return;
      }

      const templateKeys = Object.keys(this.menuMap);
      const allPaths = getFilePaths(this.menuMap);

      this.spreadsheet.obj.forEach((v, i) => {
        this.status.text = `Processing template #${i + 1}: ${v["comp title"]}`;

        const matches = templateKeys.filter((temp) =>
          new RegExp(`t${v.template}_[0-9]+`, "i").test(temp)
        );
        if (matches.length < 1) {
          alert(`Could not find template ${v.template} in project. Skipping!`);
          return;
        }
        const tempName = matches[0];
        const paths = allPaths.filter((path) => path.includes(tempName));

        project.log("");
        paths.forEach((path) => {
          project.log(path);
        });
        project.log("");

        const spreadsheetFields = Object.entries(v);

        spreadsheetFields.forEach(([key, value]) => {
          if (/comp(?:osition)?\W*title/i.test(key)) {
            compTitle.txt.text = value;
            return;
          }

          const titleInfo = this.parseCategoryTitle(key) || { title: key };
          const possiblePaths = paths.filter((path) => {
            path = path.replace(/\W/g, "");
            const titleMatch = new RegExp(titleInfo.title.replace(/\W/g, ""), "i").test(path);
            const groupMatch = titleInfo.group
              ? new RegExp(titleInfo.group.replace(/\W/g, ""), "i").test(path)
              : true;

            return titleMatch && groupMatch;
          });

          if (possiblePaths.length > 0) {
            const path = possiblePaths[0];
            set(template, `${path}.text`, value);
            // project.log(path);
            console.log(value);
          }
        });

        sa_262_ii(template[tempName], this.renderOp, v["output file"]);
        this.progressbar1.value = Math.floor((100 * (i + 1)) / this.spreadsheet.obj.length);
      });

      this.status.text = "Finished! Select another spreadsheet or click done.";
    },

    getExportType: function () {
      return this.exportType;
    },
  };
};

export { createSpreadsheetDialog };
