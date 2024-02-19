// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { testIt } from "./playground/tests";
import { TemplateMain } from "./classes/template/TemplateMain";
import polyfill from "./tools/polyfill";

polyfill();

const template = new TemplateMain();

function SA__getMenuInfo() {
  try {
    const overview = template.getOverview();
    const json = JSON.stringify(overview);
    return json;
  } catch (error) {
    alert(`Error: ${error}
    ${error.stack}`);
  }
}

function SA__writeOverview() {
  const newFile = File.saveDialog("Save the menu info (.json)", "JSON: *.json");
  newFile.open("w");
  newFile.write(SA__getMenuInfo());
  newFile.close();

  return "OK";
}

function SA__setValuesFromList(list: string) {
  const parsed: InputTemplateValue[] = JSON.parse(list);
  template.setValuesFromList(parsed);
  return "OK";
}

function SA__showMenu() {
  template.showMenuPanel();
}

function SA__selectFile(type: "csv" | "other" = "other") {
  let file;
  if (type === "csv") {
    file = File.openDialog("Select a CSV file", "Comma Separated Values: *.csv");
  } else {
    file = File.openDialog("Select a file");
  }
  return file;
}

function SA__testIt() {
  testIt(template);
}

function SA__SayHello() {
  alert("CS Interface made connection with root host function.");
}

// The global functions get removed by the compiler if they are not used
// This is a workaround to keep them in the final bundle
$.write(`getMenuInfo: ${typeof SA__getMenuInfo}`);
$.write(`setValuesFromList: ${typeof SA__setValuesFromList}`);
$.write(`showMenu: ${typeof SA__showMenu}`);
$.write(`writeOverview: ${typeof SA__writeOverview}`);
$.write(`selectFile: ${typeof SA__selectFile}`);
$.write(`testIt: ${typeof SA__testIt}`);
$.write(`SayHello: ${typeof SA__SayHello}`);

// SA__writeOverview();
// testIt(template);

// SA__writeOverview();
