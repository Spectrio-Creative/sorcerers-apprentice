import stringify from "fast-safe-stringify";
import { project } from "../../globals/globals";
import { getSpreadsheet } from "../../tools/spreadsheet/tools";

const createSpreadsheet = () => {
  const csv = File.openDialog("Please select CSV Spreadsheet.");
  const spreadsheet = getSpreadsheet(csv);
  if (!spreadsheet) return;

  return {
    file: csv,
    obj: spreadsheet,

    logSheet: function (text) {
      if (text) project.log(text);
      project.log(stringify(this.obj));
    },

    getNewSpreadsheet: function () {
      const csv = File.openDialog("Please select CSV Spreadsheet.");
      const newSheet = getSpreadsheet(csv);

      if (newSheet) {
        this.file = csv;
        this.obj = newSheet;
      }
    },
  };
};

export { createSpreadsheet };
