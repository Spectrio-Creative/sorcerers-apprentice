import { compTitle } from "../globals/project/menu";
import { status } from "../globals/project/status";
import { GoodBoyNinjaColorPicker, colorize, decToRgb } from "./colors";

// COLOR BUTTON SETUP
// ====
export function colorBtn(inputFld: Button) {
  const parent = inputFld.parent as ColorGroup;
  parent.txt.text = decToRgb(GoodBoyNinjaColorPicker(colorize(parent.txt.text)));
}

// BROWSER BUTTON SETUP - ALL FILES EXCEPT THE OUTPUT FOLDER
// ====
export function browserBtn(inputFld: Button) {
  const file = new File("NewFile.mp4");
  const slash = $.os.indexOf("Windows") !== -1 ? "\\" : "/";
  const name = compTitle.txt.text !== "" ? compTitle.txt.text : "videoID";
  file.changePath(app.project.file.parent.fsName + slash + name);

  const parent = inputFld.parent as BrowseGroup;

  status.set(parent.name);

  let textLocation = "media";
  if (parent.txt !== undefined) {
    textLocation = "txt";
  }

  //   let defaultFolder = inputFld.parent[textLocation].text;
  //   if ($.os.indexOf("Windows") !== -1)
  //     // On Windows, escape backslashes first
  //     defaultFolder = defaultFolder.replace("\\", "\\\\");

  let fileF;
  if (parent.name === "outFolder") {
    /*const folder = new Folder(file.parent);
        //fileF = folder.execute();*/
    fileF = file.saveDlg();
  } else {
    fileF = File.openDialog(parent.name, "*.*", false);
  }

  if (fileF !== null) parent[textLocation].text = fileF.fsName;
}
