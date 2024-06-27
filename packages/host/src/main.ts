import { TemplateMain } from "./classes/template/TemplateMain";
import polyfill from "./tools/polyfill";
import { systemRoot, log } from "./tools/system";
import { saveFile as saveExport, openCSV, openMediaFile, constructFileResponse } from "./tools/fs";
import { version } from "../../../package.json";
import { saveFormatsJSON } from "./tools/ame/formatsAECompiled";
import { queueInAME } from "./tools/ame";

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
    const compIds = template.setValuesFromList(parsed);
    return JSON.stringify({
      status: "OK",
      compIds,
    });
  }

  function sendCompsToAME(data: AMEComp[], startRender = false): string {
    // Save the project so that the comp is available to AME
    app.project.save();
    queueInAME(data, startRender);
    return JSON.stringify({
      status: "OK",
    });
  }

  function showMenu() {
    template.showMenuPanel();
  }

  function selectFile(type: SorcererFile = "other") {
    if (type === "csv") {
      return openCSV();
    }

    if (type === "image" || type === "video") {
      return openMediaFile();
    }

    return JSON.stringify(constructFileResponse(File.openDialog("Select a file", "*.*", false)));
  }

  function saveFile(data?: string, type: SorcererFile = "other"): string {
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
    const testFile = systemRoot.createRootFile("test.txt");
    testFile.open("w");
    testFile.write("Test file created");
    testFile.close();
  }

  function SayHello() {
    alert("CS Interface made connection with root host function.");
  }

  function fetchAMEFormatsData() {
    const ameFormats = systemRoot.createRootFile("ameFormats.json");
    if (!ameFormats.exists) return JSON.stringify({});
    ameFormats.open("r");
    const data = JSON.parse(ameFormats.read());
    return JSON.stringify(data);
  }

  function refreshAMEFormatsData() {
    const ameFormats = systemRoot.createRootFile("ameFormats.json");
    let finished = false;
    saveFormatsJSON({
      jsonLocation: ameFormats,
      callback: () => {
        finished = true;
        alert("AME Formats data refreshed");
      },
    });
  }

  return {
    getMenuInfo,
    setValuesFromList,
    sendCompsToAME,
    showMenu,
    writeOverview,
    selectFile,
    saveFile,
    testIt,
    SayHello,
    fetchAMEFormatsData,
    refreshAMEFormatsData,
  };
}

const ss = createSSNamespace();

// Make sure the namespace is available in the global scope
$.write(`namespace: ${typeof ss}`);
