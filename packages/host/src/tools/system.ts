import { version } from "../../../../package.json";

export const slash = system.osName === "windows" ? "\\" : "/";

/**
 * Creates a new file object in the same directory as the script.
 * @param fileName The name of the file to create.
 */
export const createRootFile = (fileName: string, subDirectory?: string) => {
  let filePath = Folder.userData.fsName;
  filePath += `${slash}com.spectrio.sorcerer`;
  if (!Folder(`${filePath}`).exists) Folder(`${filePath}`).create();
  if (subDirectory) filePath += `${slash}${subDirectory}`;
  if (!Folder(`${filePath}`).exists) Folder(`${filePath}`).create();
  return new File(`${filePath}${slash}${fileName}`);
};

/**
 * Logs a message to a log file in the same directory as the script.
 * @param text The message to log.
 */
export function log(text: string) {
  // Check if log file exists and create it if it doesn't

  const logFile = createRootFile(`log.txt`, version);
  if (!logFile.exists) {
    logFile.open("w");
    logFile.write("Log file created\n");
    logFile.close();
  }

  const currentDateTime = new Date().toLocaleString(undefined, { dateStyle: "short", dayPeriod: "short" });
  text = `${currentDateTime} - ${text}`;

  // Write to log file
  logFile.open("a");
  logFile.write(`${text}\n`);
  logFile.close();
}
