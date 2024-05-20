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
    },
    false
  );
};

export interface SaveFileOptions {
  fileName?: string;
  type?: ExportFile;
}

export const saveCSV = (data?: string, _options?: SaveFileOptions) => {
  let filter: string | ((file: File | Folder) => boolean) = "CSV: *.csv";
  if (File.fs !== "Windows") {
    filter = function (file: File | Folder) {
      if (file instanceof Folder) return true;
      if (file.hidden) return false;
      if (file.name.match(/\.csv$/i)) return true;
      if (file.type == "CSV ") return true;
    };
  }
  const newFile = File.saveDialog("Save the CSV file", filter);
  if (!data) return newFile;
  newFile.open("w");
  newFile.write(data);
  newFile.close();
  return newFile;
};

export const saveMP4 = () => {
  let filter: string | ((file: File | Folder) => boolean) = "MP4: *.mp4";
  if (File.fs !== "Windows") {
    filter = function (file: File | Folder) {
      if (file instanceof Folder) return true;
      if (file.hidden) return false;
      if (file.name.match(/\.mp4$/i)) return true;
      if (file.type == "MP4 ") return true;
    };
  }
  const newFile = File.saveDialog("Save the MP4 file", filter);
  return newFile;
};

export const saveOther = (data?: string, _options?: SaveFileOptions) => {
  let filter: string | ((file: File | Folder) => boolean) = "*.*";
  if (File.fs !== "Windows") {
    filter = function (file: File | Folder) {
      if (file instanceof Folder) return true;
      if (file.hidden) return false;
      return true;
    };
  }
  const newFile = File.saveDialog("Save the file", filter);
  if (!data) return newFile;
  newFile.open("w");
  newFile.write(data);
  newFile.close();
  return newFile;
};