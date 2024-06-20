// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { testIt as playground } from "./playground/tests";
import { TemplateMain } from "./classes/template/TemplateMain";
import polyfill from "./tools/polyfill";
import { log } from "./tools/system";
import { saveFile as saveExport, openCSV } from "./tools/fs";
import { version } from "../../../package.json";

polyfill();

// Create namespace to avoid conflicts with global
export function createSSNamespace() {
  log(`Running Sorcerer's Apprentice Script (v${version})`);
  const template = new TemplateMain();

  function getMenuInfo() {
    try {
      // template = new TemplateMain();
      const overview = template.getOverview();
      const json = JSON.stringify(overview);
      return json;
    } catch (error) {
      alert(`Error: ${error}
    ${error.stack}`);
    }
  }

  function writeOverview() {
    log("Writing overview");
    const newFile = File.saveDialog("Save the menu info (.json)", "JSON: *.json");
    newFile.open("w");
    newFile.write(getMenuInfo());
    newFile.close();

    return "OK";
  }

  function setValuesFromList(list: string) {
    const parsed: InputTemplateValue[] = JSON.parse(list);
    template.setValuesFromList(parsed);
    return "OK";
  }

  function showMenu() {
    template.showMenuPanel();
  }

  function selectFile(type: ImportFile = "other") {
    if (type === "csv") {
      return openCSV();
    }

    return File.openDialog("Select a file", "*.*", false);
  }

  function saveFile(data?: string, type: ExportFile = "other") {
    try {
      const file: File = saveExport(data, { type });

      if (!file) return JSON.stringify({ status: "CANCELLED", file });
      const filePath = file.fsName;
      const fileName = file.name;

      return JSON.stringify({ status: "OK", file, filePath, fileName });
    } catch (error) {
      return JSON.stringify({ status: "ERROR", error: error.message });
    }
  }

  function testIt() {
    playground(template);
  }

  function SayHello() {
    alert("CS Interface made connection with root host function.");
  }

  return {
    getMenuInfo,
    setValuesFromList,
    showMenu,
    writeOverview,
    selectFile,
    saveFile,
    testIt,
    SayHello,
  };
}

const ss = createSSNamespace();

// Make sure the namespace is available in the global scope
$.write(`namespace: ${typeof ss}`);
