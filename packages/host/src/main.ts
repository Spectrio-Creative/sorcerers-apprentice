import { TemplateMain } from "./classes/template/TemplateMain";
import { testIt } from "./playground/tests";
import polyfill from "./tools/polyfill";

polyfill();

const template = new TemplateMain();

function getMenuInfo() {
  return JSON.stringify(template.getOverview());
}

function writeOverview() {
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


function selectFile(type: "csv" | "other" = "other") {
  let file;
  if (type === "csv") {
    file = File.openDialog("Select a CSV file", "Comma Separated Values: *.csv");
  } else {
    file = File.openDialog("Select a file");
  }
  return file;
}

// function selectFolder() {
//   const folder = new Folder();
//   folder = folder.selectDlg("Select a folder to save");
//   return folder;
// }

// function printKeys(object: GenericObject<string[]>) {
//   const keys = Object.keys(object);
//   keys.forEach((key) => {
//     alert(`${key}`);
//     alert(`${key}: ${object[key]}`);
//   });
// }

// The global functions get removed by the compiler if they are not used
// This is a workaround to keep them in the final bundle
$.write(`getMenuInfo: ${typeof getMenuInfo}`);
$.write(`setValuesFromList: ${typeof setValuesFromList}`);
$.write(`showMenu: ${typeof showMenu}`);
$.write(`writeOverview: ${typeof writeOverview}`);
$.write(`selectFile: ${typeof selectFile}`);


// writeOverview();
testIt(template);
