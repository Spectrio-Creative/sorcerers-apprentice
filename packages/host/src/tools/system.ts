import { SystemRoot } from "../classes/SystemRoot";

export const systemRoot = new SystemRoot();

export const slash = systemRoot.slash;

/**
 * Creates a new file object in the same directory as the script.
 * @param fileName The name of the file to create.
 */
export const createRootFile = systemRoot.createRootFile;

/**
 * Logs a message to a log file in the same directory as the script.
 * @param text The message to log.
 */
export function log(text: string) {
  systemRoot.log(text);
}
