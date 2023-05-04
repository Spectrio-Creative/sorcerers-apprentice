import { snakeCase, spaceCase } from "case-anything";
// import stringify from "fast-safe-stringify";
import get from "just-safe-get";
import set from "just-safe-set";
import { project } from "../../globals/project/project";
import { compTitle, status, template } from "../../globals/project/menu";
// import { sa_262_ii } from "../../legacy/mdsRender";
import { getFilePaths, mapMenu } from "../../tools/dialog/template";
import { parseTabTitle } from "../../tools/library/sorcererDictionary";
import { showSpreadSheetInfo } from "../info";
import { createSpreadsheet, Spreadsheet } from "./Spreadsheet";
import { renderMain } from "../../globals/globals";

export interface SpreadsheetDialog {
  canceled: boolean;
  success: boolean;
  canExport: boolean;
  exportType: "Traditional" | "Spreadsheet";
  exportables: GenericObject;
  spreadsheet: null | Spreadsheet;
  menuMap: GenericObject;
  singleCSV: boolean;
  renderOption: RenderOption;
  renderOptions: RenderOption[];
  checkLocation: (location: string | null) => boolean;
  iterateExportables: (
    callbackfn: (value: [string, unknown], index: number, array: [string, unknown][]) => void,
    thisArg?: any
  ) => void;
  printCSVs: () => void;
  show: () => void;
  parseCategoryTitle: (fullTitle: string) => { input: string; group: string; title: string };
  processSheet: () => void;
}

const createSpreadsheetDialog = (exportables: GenericObject = {}) => {
  return {
    canceled: false,
    success: false,
    canExport: false,
    exportType: "Traditional",
    location: "~/",
    exportables,
    spreadsheet: null,
    menuMap: mapMenu(template),
    singleCSV: false,
    renderOption: "compOnly",
    renderOptions: ["aeQueueOnly", "queueOnly", "compOnly", "renderAlso"],

    checkLocation: function (location: string | null) {
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

      const prefix = app.project.file ? spaceCase(app.project.file.name.replace(".aep", "")) + " " : "";

      const chooseLocation = project.addLocation("demo_csvs", "Choose folder for CSVs");
      if (!chooseLocation) return;

      if (this.singleCSV) {
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
            if (columnIndex === -1) {
              columnIndex = csv[0].length;
              csv[0].push(`"[${group}] ${capTitle}"`);
            }
            csv[index][columnIndex] = `"${val}"`;
          });
        });
        const csvString = csv.reducer((t, c) => t + c.reducer((it, ic) => it + "," + (ic || "")) + "\n", "");
        project.addFileFromString(csvString, `${snakeCase(prefix)}.csv`, "demo_csvs");
        alert("Template csv exported!");
      } else {
        templates.forEach((temp, i) => {
          const tempTitle = (parseTabTitle(temp) || { title: temp }).title;
          csv[i] = [["Template"], [tempTitle]];

          csv[i][0].push("Comp Title", "Output File");
          csv[i][1].push(tempTitle, "~/");

          const paths = allPaths.filter((path) => path.includes(temp));
          paths.forEach((path) => {
            const pathParts = path.split(".");
            if (pathParts.length < 4) return;
            const [_tempName, _content, group, title] = pathParts;
            // spaceCase()
            let capTitle = spaceCase(title);
            capTitle = capTitle.charAt(0).toUpperCase() + capTitle.slice(1);
            const val = get(template, `${path}.text`);

            csv[i][0].push(`"[${group}] ${capTitle}"`);
            csv[i][1].push(`"${val}"`);
          });
          const csvString = csv[i].reducer((t, c) => t + c.reducer((it, ic) => it + "," + ic) + "\n", "");
          project.addFileFromString(csvString, `${snakeCase(prefix + tempTitle)}.csv`, "demo_csvs");
        });
        alert(`${templates.length} template csv(s) exported!`);
      }
    },

    show: function () {
      /*
      Code for Import https://scriptui.joonas.me — (Triple click to select): 
      {"activeId":72,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"text":"The Sorcerer’s Apprentice","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"],"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"enabled":true}},"item-19":{"id":19,"type":"Group","parentId":0,"style":{"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null,"varName":null,"enabled":true}},"item-36":{"id":36,"type":"Group","parentId":0,"style":{"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["center","top"],"alignment":null,"varName":"finished","enabled":true}},"item-37":{"id":37,"type":"Button","parentId":36,"style":{"text":"DONE","justify":"center","preferredSize":[0,0],"alignment":null,"varName":"done","helpTip":null,"enabled":true}},"item-45":{"id":45,"type":"Panel","parentId":19,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Spreadsheet Export","preferredSize":[360,0],"margins":[15,20,10,20],"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-52":{"id":52,"type":"Group","parentId":45,"style":{"enabled":true,"varName":"exportModeGroup","preferredSize":[0,0],"margins":[0,0,10,0],"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-54":{"id":54,"type":"StaticText","parentId":52,"style":{"enabled":true,"varName":"exportModeText","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"CSV:","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-60":{"id":60,"type":"Button","parentId":36,"style":{"enabled":true,"varName":"createCSV","text":"CREATE CSV(S)","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-62":{"id":62,"type":"EditText","parentId":52,"style":{"enabled":false,"varName":"filePath","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"","justify":"left","preferredSize":[190,0],"alignment":null,"helpTip":null}},"item-63":{"id":63,"type":"Button","parentId":52,"style":{"enabled":true,"varName":null,"text":"Select","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-66":{"id":66,"type":"Progressbar","parentId":45,"style":{"enabled":true,"varName":null,"preferredSize":[358,4],"alignment":null,"helpTip":null}},"item-67":{"id":67,"type":"StaticText","parentId":45,"style":{"enabled":true,"varName":"status","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Select a spreadsheet and press 'Go' to process!","justify":"left","preferredSize":[301,18],"alignment":null,"helpTip":null}},"item-68":{"id":68,"type":"Button","parentId":52,"style":{"enabled":true,"varName":"process","text":"Go","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-69":{"id":69,"type":"Checkbox","parentId":71,"style":{"enabled":true,"varName":"singleCsv","text":"Single CSV*","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-70":{"id":70,"type":"Checkbox","parentId":71,"style":{"enabled":true,"varName":"renderQ","text":"Add to Render Queue","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-71":{"id":71,"type":"Group","parentId":45,"style":{"enabled":true,"varName":"additionalOptions","preferredSize":[0,0],"margins":[0,0,10,0],"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-72":{"id":72,"type":"Button","parentId":36,"style":{"enabled":true,"varName":"info","text":"Info (*)","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,19,45,52,54,62,63,68,71,69,70,66,67,36,72,60,37],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"functionWrapper":false,"compactCode":false,"showDialog":true,"afterEffectsDockable":false,"itemReferenceList":"None"}}
      */

      // DIALOG
      // ======
      const dialog = new Window("dialog");
      dialog.text = "The Sorcerer’s Apprentice";
      dialog.orientation = "column";
      // dialog.alignChildren = ["center", "top"];
      dialog.spacing = 10;
      dialog.margins = 16;

      // GROUP1
      // ======
      const group1 = dialog.add("group", undefined, { name: "group1" });
      group1.orientation = "column";
      group1.alignChildren = ["left", "top"];
      group1.spacing = 10;
      group1.margins = 0;

      // PANEL1
      // ======
      const panel1 = group1.add("panel", undefined, undefined, { name: "panel1" });
      panel1.text = "Spreadsheet Export";
      panel1.preferredSize.width = 360;
      panel1.orientation = "column";
      panel1.alignChildren = "left";
      panel1.spacing = 10;
      panel1.margins = [20, 15, 20, 10];

      // EXPORTMODEGROUP
      // ===============
      const exportModeGroup = panel1.add("group", undefined, { name: "exportModeGroup" });
      exportModeGroup.orientation = "row";
      exportModeGroup.alignChildren = ["left", "center"];
      exportModeGroup.spacing = 10;
      exportModeGroup.margins = 0;

      const exportModeText = exportModeGroup.add("statictext", undefined, undefined, {
        name: "exportModeText",
      });
      exportModeText.text = "CSV:";

      const filePath: EditText = exportModeGroup.add("edittext", undefined, this.location, { name: "filePath" });
      // filePath.enabled = false;
      filePath.text = this.location;
      filePath.preferredSize.width = 190;

      const button1 = exportModeGroup.add("button", undefined, undefined, { name: "button1" });
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

      const process = exportModeGroup.add("button", undefined, undefined, { name: "process" });
      process.text = "Go";
      process.onClick = () => {
        this.processSheet();
      };

      // ADDITIONALOPTIONS
      // =================
      const additionalOptions = panel1.add("group", undefined, { name: "additionalOptions" });
      additionalOptions.orientation = "row";
      additionalOptions.alignChildren = ["left", "center"];
      additionalOptions.spacing = 10;
      additionalOptions.margins = [0, 0, 0, 10];

      const singleCsv = additionalOptions.add("checkbox", undefined, undefined, { name: "singleCsv" });
      singleCsv.text = "Single CSV*";
      singleCsv.value = false;
      singleCsv.onClick = () => {
        this.singleCSV = singleCsv.value;
      };

      const renderQ = additionalOptions.add("checkbox", undefined, undefined, { name: "renderQ" });
      renderQ.text = "Add to Render Queue";
      renderQ.value = false;
      renderQ.onClick = () => {
        this.renderOption = renderQ.value ? "aeQueueOnly" : "compOnly";
      };

      // PANEL1
      // ======
      this.progressbar1 = panel1.add("progressbar", undefined, undefined, 100, { name: "progressbar1" });
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
      const finished = dialog.add("group", undefined, { name: "finished" });
      finished.orientation = "row";
      finished.alignChildren = ["center", "top"];
      finished.spacing = 10;
      finished.margins = 0;

      const done = finished.add("button", undefined, undefined, { name: "done" });
      done.onClick = () => {
        dialog.close();
      };
      done.text = "DONE";

      const createCSV = finished.add("button", undefined, undefined, { name: "createCSV" });
      createCSV.text = "CREATE CSV(S)";
      createCSV.onClick = () => {
        this.printCSVs();
      };

      const info = finished.add("button", undefined, undefined, { name: "info" });
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

    processSheet: function (): void {
      if (!this.spreadsheet) {
        alert("First select a spreadsheet!");
        return;
      }

      project.log("\nProcessing Sheet\n\n");

      const templateKeys = Object.keys(this.menuMap);
      const allPaths = getFilePaths(this.menuMap);

      (this.spreadsheet as Spreadsheet).obj.forEach((v, i) => {
        this.status.text = `Processing template #${i + 1}: ${v["comp title"]}`;

        const matches = templateKeys.filter((temp) => new RegExp(`t${v.template}_[0-9]+`, "i").test(temp));
        if (matches.length < 1) {
          alert(`Could not find template ${v.template} in project. Skipping!`);
          return;
        }
        const tempName = matches[0];
        const paths = allPaths.filter((path) => path.includes(tempName));

        const spreadsheetFields = Object.entries(v);

        spreadsheetFields.forEach(([key, value]) => {
          const visibilityToggle = /^\[([ x])\]/;
          const visibilityToggleTest = /^\[[ x]\]/;
          const rawValue = value;
          const textValue = value.replace(visibilityToggleTest, "").trim();

          if (/comp(?:osition)?\W*title/i.test(key)) {
            compTitle.txt.text = textValue;
            return;
          }

          const titleInfo = this.parseCategoryTitle(key) || { title: key };
          const titleSansSpace = titleInfo.title.replace(/\W/g, "");

          const possiblePaths = paths.filter((path) => {
            path = path.replace(/\W/g, "");
            const titleMatch = new RegExp(titleSansSpace, "i").test(path);
            const groupMatch = titleInfo.group ? new RegExp(titleInfo.group.replace(/\W/g, ""), "i").test(path) : true;

            return titleMatch && groupMatch;
          });

          if (possiblePaths.length > 1) {
            const exactMatch = new RegExp(".|^" + titleSansSpace + ".|$", "i");
            possiblePaths.sort((a) => (exactMatch.test(a) ? -1 : 1));
          }

          if (possiblePaths.length > 0) {
            const path = possiblePaths[0];
            set(template, `${path}.text`, textValue);

            const templatePart = get(template, path.replace(/\.[^.]+$/, ""));

            if (templatePart.visibilityToggle && visibilityToggle.test(rawValue.trim())) {
              (templatePart.visibilityToggle as Checkbox).value = value.match(visibilityToggle).includes("x");
              // (templatePart.visibilityToggle as Checkbox).value = value !== "" && value !== "[none]";
            }
          }
        });

        const renderer = renderMain.getRenderer(tempName);
        renderer.renderOp = this.renderOption;
        renderer.outFile = v["output file"];
        renderer.render();

        // sa_262_ii(template[tempName], this.renderOp, v["output file"]);
        this.progressbar1.value = Math.floor((100 * (i + 1)) / this.spreadsheet.obj.length);
      });

      this.status.text = "Finished! Select another spreadsheet or click done.";
    },

    getExportType: function () {
      return this.exportType;
    },
  } as SpreadsheetDialog;
};

export { createSpreadsheetDialog };
