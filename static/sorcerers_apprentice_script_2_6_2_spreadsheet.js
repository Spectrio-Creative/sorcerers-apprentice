import * as ui from "../src/uiGroupTemplates";
import { project, renderMain } from "../src/globals/globals";
import { createSpreadsheetDialog } from "../src/spreadsheet/classes/SpreadsheetDialog";
import { TraditionalRenderDialog } from "../src/classes/TraditionalRenderDialog";
import { sa_262_ii } from "../src/legacy/mdsRender";
import { colorize, decToRgb, GoodBoyNinjaColorPicker } from "../src/tools/colors";
import { colorBtn, browserBtn } from "../src/tools/buttonFunctions";
import { libItemsInFolder, findLayers, libItemsReg, regSafe, getPreComps } from "../src/tools/ae";
import {
  mds,
  compTitle,
  outFolder,
  template,
  compBtn,
  queueBtn,
  renderBtn,
  pbar,
  status,
} from "../src/globals/project/menu";
import { arrIndex } from "../src/tools/legacyTools";
import { fontStylesMaster, allEditableLayers } from "../src/globals/legacySupport";
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
