export const openCSV = () => {
  if (File.fs === "Windows") {
    return File.openDialog("Open CSV file", "Text: *.csv,All files: *.*", false);
  }
  alert(File.fs);

  return File.openDialog(
    "Open CSV file",
    function (file: File | Folder) {
      if (file instanceof Folder) return true;
      if (file.hidden) return false;
      if (file.name.match(/\.csv$/i)) return true;
      if (file.type == "CSV ") return true;
      return false;
    },
    false
  );
};

export interface SaveFileOptions {
  fileName?: string;
  prompt?: string;
  type?: ExportFile;
}

export const fileFiltersMac = (type: ExportFile) => {
  switch (type) {
    case "csv":
      return function (file: File) {
        if (file.name.match(/\.csv$/i)) return true;
        if (file.type == "CSV ") return true;
        return false;
      };
    case "mp4":
      return function (file: File) {
        if (file.name.match(/\.mp4$/i)) return true;
        if (file.type == "MP4 ") return true;
        return false;
      };
    default:
      return function () {
        return true;
      };
  }
};

export const fileFiltersWindows = (type: ExportFile) => {
  if (type === "csv") return "CSV: *.csv";
  if (type === "mp4") return "MP4: *.mp4";
  return "*.*";
};

export const saveFile = (data?: string, options?: SaveFileOptions) => {
  const type = options?.type || "other";
  const _fileName = options?.fileName || "file";
  const prompt = options?.prompt || `Save the ${type} file`;

  let filter: string | ((file: File | Folder) => boolean) = fileFiltersWindows(type);

  if (File.fs !== "Windows") {
    const filterFunction = fileFiltersMac(type);
    filter = function (file: File | Folder) {
      if (file instanceof Folder) return true;
      if (file.hidden) return false;
      return filterFunction(file);
    };
  }
  const newFile = File.saveDialog(prompt, filter);
  if (!data) return newFile;
  newFile.open("w");
  newFile.write(data);
  newFile.close();
  return newFile;
};