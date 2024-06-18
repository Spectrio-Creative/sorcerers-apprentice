import { escapeRegExp } from "./regex";

export const scriptName = new File($.fileName).name;

export const scriptPath = (new File($.fileName).fsName).replace(new RegExp(`${escapeRegExp(scriptName)}$`), "");

export const slash = system.osName === "windows" ? "\\" : "/";

/**
 * Creates a new file object in the same directory as the script.
 * @param fileName The name of the file to create.
 */
export const createRootFile = (fileName: string) => {
  return new File(`${scriptPath}${slash}${fileName}`);
}

/**
 * Logs a message to a log file in the same directory as the script.
 * @param text The message to log.
 */
export function log(text: string) {
  // Check if log file exists and create it if it doesn't
  const scriptNameSansExt = scriptName.split(".")[0];
  const logFile = createRootFile(`${scriptNameSansExt}-log.txt`);
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
