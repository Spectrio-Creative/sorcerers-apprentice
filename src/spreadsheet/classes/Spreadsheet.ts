import stringify from "fast-safe-stringify";
import { project } from "../../globals/globals";
import { getSpreadsheet } from "../../tools/spreadsheet/tools";

export interface Spreadsheet {
  file:File;
  obj:{[key:string]:any};
  logSheet: (text?:string) => void;
  getNewSpreadsheet: () => void;
}

const createSpreadsheet = () => {
  const csv = File.openDialog("Please select CSV Spreadsheet.");
  const spreadsheet = getSpreadsheet(csv);
  if (!spreadsheet) return;

  return {
    file: csv,
    obj: spreadsheet,

    logSheet: function (text?:string):void {
      if (text) project.log(text);
      project.log(stringify(this.obj));
    },

    getNewSpreadsheet: function ():void {
      const csv = File.openDialog("Please select CSV Spreadsheet.");
      const newSheet = getSpreadsheet(csv);

      if (newSheet) {
        this.file = csv;
        this.obj = newSheet;
      }
    },
  } as Spreadsheet;
};

export { createSpreadsheet };
