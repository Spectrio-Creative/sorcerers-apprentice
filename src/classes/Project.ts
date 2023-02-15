import { createFolderTree } from "./FolderTree";
import { createInitialDialog } from "./InitialDialog";
import dateFormat from "dateformat";
import { ___ } from "../globals/document";
import extend from "just-extend";
import { roundTo } from "../tools/math";
import { menuTitle } from "../globals/project/menu";

interface Project {
  canceled: boolean;
  startTime: Date;
  stopWatch: { [key: string]: any };
  logCounters: { [key: string]: any };
  fileName: string;
  exportType: "Traditional" | "Spreadsheet";
  initialDialog: any;
  version: string;
  initialize: (version: string) => void;
  setFileName: (fileName: string) => void;
  cancel: () => void;
  createLog: (content: string) => void;
  findFilesFromFolder: (folderName: string, mask?: string, root?: string) => void;
  log: (info: string, withDate?: boolean) => void;
  count: (key: string) => void;
  finalStatus: () => void;
  startTimer: (timerName: string, override: Date) => void;
  split: (timerName: string, reset: boolean) => void;
}

const createProject = (fileName: string): Project => {
  const folderTree = createFolderTree();
  const projectDetails: Project = {
    canceled: false,
    startTime: new Date(),
    stopWatch: {},
    logCounters: {},
    fileName: fileName || "",
    exportType: "Traditional",
    initialDialog: createInitialDialog(),
    version: "0.0.0",
    initialize: function (version) {
      version = version || "0.0.1";
      this.version = version;

      menuTitle.text = `The Sorcerer's Apprentice (v${version})`;
      this.initialDialog.version = version;
      this.initialDialog.show();
      if (this.initialDialog.canceled) return false;
      this.exportType = this.initialDialog.exportType;
      this.createProjectFolder();
      this.createLog(
        `~${this.fileName}~\nExport ${dateFormat(
          this.startTime,
          "mmm d, yyyy"
        )} \nThe Sorcerer’s Apprentice v${version}\n`
      );

      return true;
    },

    setFileName: function (fileName) {
      this.fileName = fileName || this.fileName;
    },

    cancel: function () {
      this.canceled = true;
    },

    createLog: function (content) {
      this.split();
      content = content || "";
      this.logLocation = "resources";
      this.addFileFromString(content, "export-log.txt", this.logLocation);
    },

    findFilesFromFolder: function (folderName, mask = "*", root = "") {
      if (!this.root) return false;

      const rootFolder = new Folder(this.root.absoluteURI + root.replace(/\//g, ___));
      const rootFiles = rootFolder.getFiles();

      const folderReg = typeof folderName === "string" ? new RegExp(folderName) : folderName;
      const folder: Folder = rootFiles.find(
        (folder) => folder instanceof Folder && folderReg.test(folder.name)
      ) as Folder;

      if (folder && folder.exists) {
        const files = folder.getFiles(mask);
        return files;
      }
      return false;
    },

    log: function (info: string, withDate = false) {
      const now = new Date();
      const content = withDate ? `\n[${dateFormat(now, "HH:MM:ss")}]: ${info}` : `\n${info}`;
      this.appendToFileFromString(content, this.logLocation, "export-log.txt");
    },

    count: function (key) {
      if (!this.logCounters[key]) this.logCounters[key] = 0;
      this.logCounters[key]++;
    },

    finalStatus: function () {
      let result = "\n/***** LOG COUNTS *****/\n";
      for (const [key, value] of Object.entries(this.logCounters)) {
        result += `${key}: ${value}\n`;
      }

      result += "/*** END LOG COUNTS ***/\n\n";
      const now = new Date();
      result += `Export finished at ${dateFormat(now, "HH:MM:ss")} in ${this.split()}s`;

      this.log(result, false);
    },

    startTimer: function (timerName, override) {
      this.stopWatch[timerName] = override || new Date();
    },

    split: function (timerName, reset = false) {
      const watch = this.stopWatch[timerName] || this.startTime;
      const now = new Date();
      const diff = now.getTime() - watch.getTime();
      if (reset && timerName) this.startTimer(timerName, now);
      return roundTo(diff / 1000, 100);
    },
  };

  return extend(folderTree, projectDetails) as Project;
};

export { createProject };
