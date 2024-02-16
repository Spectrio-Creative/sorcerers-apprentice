import { project, renderMain } from "../src/globals/globals";
import { createSpreadsheetDialog } from "../src/spreadsheet/classes/SpreadsheetDialog";
import { TraditionalRenderDialog } from "../src/classes/TraditionalRenderDialog";
import { browserBtn } from "../src/tools/buttonFunctions";
import { outFolder, template } from "../src/globals/project/menu";
import { allEditableLayers } from "../src/globals/legacySupport";
import { poplateTabs, populateTemplates } from "../src/legacy/legacySetup";

function sa_262() {
  var templateArray = populateTemplates(template);
  for (var i = 0; i < templateArray.length; i++) {
    poplateTabs(templateArray[i], template);
  }

  renderMain.createRenderersFromTemplate();

  outFolder.browse.onClick = function () {
    browserBtn(this);
  };

  if (project.exportType === "Traditional") {
    const renderDialog = new TraditionalRenderDialog();
    renderDialog.show();
  }

  if (project.exportType === "Spreadsheet") {
    const spreadsheetDialog = createSpreadsheetDialog(allEditableLayers);
    spreadsheetDialog.show();
  }
}

export default sa_262;
