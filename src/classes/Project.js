import { createFolderTree } from "./FolderTree";
import { createInitialDialog } from "./InitialDialog";
import dateFormat from "dateformat";
import { ___ } from "../globals/document";
import extend from "just-extend";

const createProject = (fileName) => {
  const folderTree = createFolderTree();
  return extend(folderTree, {
    canceled: false,
    startTime: new Date(),
    stopWatch: {},
    logCounters: {},
    fileName: fileName || "",
    exportType: "Traditional",
    initialDialog: createInitialDialog(),
    initialize: function (version) {
      version = version || "0.0.1";
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
      const folder = rootFiles.find((file) => !file.type && folderReg.test(file.name));

      if (folder && folder.exists) {
        const files = folder.getFiles(mask);
        return files;
      }
      return false;
    },

    log: function (string, withDate = false) {
      const now = new Date();
      const content = withDate ? `\n[${dateFormat(now, "HH:MM:ss")}]: ${string}` : `\n${string}`;
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

    startTimer: function (timer, override) {
      this.stopWatch[timer] = override || new Date();
    },

    split: function (timer, reset) {
      const watch = this.stopWatch[timer] || this.startTime;
      const now = new Date();
      const diff = now.getTime() - watch.getTime();
      if (reset && timer) this.startTimer(timer, now);
      return Math.roundTo(diff / 1000, 100);
    },
  });
};

export { createProject };
