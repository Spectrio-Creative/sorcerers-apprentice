import { version as scriptVersion } from "../package.json";
import { prepare } from "./tools/setup";
import { project, renderMain } from "./globals/globals";
import { poplateTabs, populateTemplates } from "./legacy/legacySetup";
import { outFolder, template, templateControl } from "./globals/project/menu";
import { browserBtn } from "./tools/buttonFunctions";
import { TraditionalRenderDialog } from "./classes/TraditionalRenderDialog";
import { createSpreadsheetDialog } from "./spreadsheet/classes/SpreadsheetDialog";
import { allEditableLayers } from "./globals/legacySupport";
import { TemplateMain } from "./classes/TemplateMain";

const main = () => {
  prepare();
  const initialized = project.initialize(scriptVersion);
  if (!initialized) return;

  const templateArray = populateTemplates(template);
  for (let i = 0; i < templateArray.length; i++) {
    poplateTabs(templateArray[i], template);
  }

  renderMain.createRenderersFromTemplate();

  outFolder.browse.onClick = function () {
    browserBtn(this);
  };

  templateControl.init();

  if (project.exportType === "Traditional") {
    const renderDialog = new TraditionalRenderDialog();
    renderDialog.show();
  }

  if (project.exportType === "Spreadsheet") {
    const spreadsheetDialog = createSpreadsheetDialog(allEditableLayers);
    spreadsheetDialog.show();
  }
};

$.write(main);
$.write(getMenuInfo);

prepare();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getMenuInfo() {
  // const templates = populateTemplates(template);
  // const tabs = [];
  // for (let i = 0; i < templates.length; i++) {
  //   tabs.push(poplateTabs(templates[i], template));
  // }
  // return { templates, tabs };
  // const renderDialog = new TraditionalRenderDialog();
  const template = new TemplateMain();

  return JSON.stringify(template.getOverview());
}
