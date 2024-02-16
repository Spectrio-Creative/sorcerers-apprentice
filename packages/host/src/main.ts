import { TemplateMain } from "./classes/template/TemplateMain";
import { testIt } from "./playground/tests";
import polyfill from "./tools/polyfill";

polyfill();

const template = new TemplateMain();

export function getMenuInfo() {
  return JSON.stringify(template.getOverview());
}

export function setValuesFromList(list: string) {
  const parsed: InputTemplateValue[] = JSON.parse(list);
  template.setValuesFromList(parsed);
}

export function showMenu() {
  template.showMenuPanel();
}

testIt(template);
