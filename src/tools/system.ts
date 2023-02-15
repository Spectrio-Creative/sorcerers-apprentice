export function revealFile(filePath) {
  if (filePath instanceof File) {
    filePath = filePath.fsName;
  }

  let command = "open -R";
  if ($.os.indexOf("Win") != -1) {
    command = "Explorer /select,";
  }
  const arg = "\"" + filePath + "\"";
  return system.callSystem(command + " " + arg);
}

export const windows = $.os.indexOf("Windows") !== -1;

export const __ = windows ? "\\" : "/";

export const slash = __;

export const systemSpace = windows ? " " : "\\ ";