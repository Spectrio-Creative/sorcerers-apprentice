import stringify from "fast-safe-stringify";
import { project } from "../../globals/project/project";
import { getSpreadsheet } from "../../tools/spreadsheet/tools";

// export interface Spreadsheet {
//   file:File;
//   obj:GenericObject[];
//   logSheet: (text?:string) => void;
//   getNewSpreadsheet: () => void;
// }

export class Spreadsheet {
  file:File;
  obj:GenericObject[];

  constructor() {
    this.getNewSpreadsheet();
  }

  logSheet(text?:string):void {
    if (text) project.log(text);
    project.log(stringify(this.obj));
  }

  openCSV(text = "Please select CSV Spreadsheet"):File|undefined {
    if (File.fs === "Windows") {
      return File.openDialog(
        text,
        "Text: *.csv,All files: *.*",
        false
      );
    }
  
    return File.openDialog(
      text,
      function (file: File | Folder) {
        if (file instanceof Folder) return true;
        if (file.hidden) return false;
        if (file.name.match(/\.csv$/i)) return true;
        if (file.type == "CSV ") return true;
        return false;
      },
      false
    );
  }

  getNewSpreadsheet():void {
    const csv = this.openCSV("Please select CSV Spreadsheet.");
    const newSheet = getSpreadsheet(csv as File);

    if (newSheet) {
      this.file = csv as File;
      this.obj = newSheet;
    }
  }
}

// const createSpreadsheet = () => {
//   const csv = File.openDialog("Please select CSV Spreadsheet.");
//   const spreadsheet = getSpreadsheet(csv as File);
//   if (!spreadsheet) return;

//   return {
//     file: csv,
//     obj: spreadsheet,

//     logSheet: function (text?:string):void {
//       if (text) project.log(text);
//       project.log(stringify(this.obj));
//     },

//     getNewSpreadsheet: function ():void {
//       const csv = File.openDialog("Please select CSV Spreadsheet.");
//       const newSheet = getSpreadsheet(csv as File);

//       if (newSheet) {
//         this.file = csv;
//         this.obj = newSheet;
//       }
//     },
//   } as Spreadsheet;
// };

export const createSpreadsheet = () => new Spreadsheet();
