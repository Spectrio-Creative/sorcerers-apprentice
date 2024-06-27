import { version } from "../../../../package.json";
import { getFormattedTimestamp } from "../tools/time";

export class SystemRoot {
  osName: "windows" | "mac";
  slash: string;
  rootFolder: Folder;
  logFile: File;

  constructor() {
    this.osName = $.os.toLowerCase().indexOf("windows") !== -1 ? "windows" : "mac";
    this.slash = this.osName === "windows" ? "\\" : "/";
    const rootPath = Folder.userData.fsName + this.slash + "com.spectrio.sorcerer";
    this.rootFolder = new Folder(rootPath);
    if (!this.rootFolder.exists) this.rootFolder.create();
    this.initializeLogFile();
  }

  /**
   * Creates a new file object in the script's AppData directory.
   * @param fileName The name of the file to create.
   */
  createRootFile(fileName: string, subDirectory?: string) {
    let filePath = this.rootFolder.fsName;
    if (subDirectory) filePath += `${this.slash}${subDirectory}`;
    if (!Folder(`${filePath}`).exists) Folder(`${filePath}`).create();
    return new File(`${filePath}${this.slash}${fileName}`);
  }

  /**
   * Creates a new file object next to the project file.
   * @param fileName The name of the file to create.
   */
  createProjectRootFile(fileName: string) {
    if (!app.project.file) return;
    const projectFolder = app.project.file.parent.fsName;
    return new File(`${projectFolder}${this.slash}${fileName}`);
  }

  /**
   * Initializes a log file in the script's AppData directory.
   */
  initializeLogFile() {
    const now = new Date();
    const currentDateTime = getFormattedTimestamp(now);
    const dateTimeExtended = now.toLocaleString(undefined, { dateStyle: "short", dayPeriod: "short" });
    const logTitle = `log-${currentDateTime}.txt`;
    this.logFile = this.createRootFile(logTitle, version);

    let initialText = `Log file created ${dateTimeExtended}\n`;
    initialText += `Script version: ${version}\n`;
    initialText += `OS: ${this.osName}\n`;
    initialText += `Root folder: ${this.rootFolder.fsName}\n`;
    initialText += `Project File: ${app.project.file?.fsName}\n`;
    initialText += `${"---------------------------------------------------------------"}\n`;

    this.logFile.open("w");
    this.logFile.write(initialText);
    this.logFile.close();
  }

  /**
   * Logs a message to a log file in the script's AppData directory.
   * @param text The message to log.
   * @param logFile The file to log to.
   * @param append Whether to append to the file or overwrite it.
   */
  log(text: string, logFile: File = this.logFile, append = true) {
    if (!logFile.exists) {
      logFile.open("w");
      logFile.write("");
      logFile.close();
    }

    const currentDateTime = getFormattedTimestamp(new Date(), { includeDate: false, includeColons: true });
    text = `${currentDateTime} - ${text}`;

    // Write to log file
    logFile.open(append ? "a" : "w");
    logFile.write(`${text}\n`);
    logFile.close();
  }
}
