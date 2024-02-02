import { version as scriptVersion } from "../package.json";
import { poplateTabs, populateTemplates } from "./legacy/legacySetup";
import { outFolder, template } from "./globals/project/menu";
import { templateControl } from "./globals/project/templateControl";
import { browserBtn } from "./tools/buttonFunctions";
import { TraditionalRenderDialog } from "./classes/TraditionalRenderDialog";
import { createSpreadsheetDialog } from "./spreadsheet/classes/SpreadsheetDialog";
import { allEditableLayers } from "./globals/legacySupport";
import { renderMain } from "./globals/project/renderMain";
import { project } from "./globals/project/project";

const main = () => {
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

main();
