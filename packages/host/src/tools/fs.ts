const videoFilter = "Video Files (*.mp4; *.avi; *.mov; *.mkv)|*.mp4; *.avi; *.mov; *.mkv|All Files (*.*)|*.*";
const csvFilter = "CSV Files (*.csv)|*.csv|All Files (*.*)|*.*";
const audioFilter = "Audio Files (*.mp3; *.wav; *.aac; *.flac; *.ogg)|*.mp3; *.wav; *.aac; *.flac; *.ogg|All Files (*.*)|*.*";
const imageFilter = "Image Files (*.jpg; *.jpeg; *.png; *.bmp; *.tiff)|*.jpg; *.jpeg; *.png; *.bmp; *.tiff|All Files (*.*)|*.*";
const visualFilter = "Visual Files (*.svg; *.pdf; *.eps; *.ai)|*.svg; *.pdf; *.eps; *.ai|All Files (*.*)|*.*";
const imageVideoFilter = "Image and Video Files (*.jpg; *.jpeg; *.png; *.bmp; *.tiff; *.mp4; *.avi; *.mov; *.mkv)|*.jpg; *.jpeg; *.png; *.bmp; *.tiff; *.mp4; *.avi; *.mov; *.mkv|All Files (*.*)|*.*";
const mediaFilter = "All Supported Files (*.mp4; *.avi; *.mov; *.mkv; *.mp3; *.wav; *.aac; *.flac; *.jpg; *.jpeg; *.png; *.bmp; *.tiff)|*.mp4; *.avi; *.mov; *.mkv; *.mp3; *.wav; *.aac; *.flac; *.jpg; *.jpeg; *.png; *.bmp; *.tiff|All Files (*.*)|*.*"
const allFilesFilter = "All Files (*.*)|*.*";

export const constructFileResponse = (file: File | null): FileResponse => {
  const response: FileResponse = {
    status: file ? "OK" : "CANCELLED",
    file: file?.fsName,
    filePath: file?.fsName,
    fileName: file?.name,
  }

  return response;
}

export const openCSV = () => {
  let file: File | null = null;
  if (File.fs === "Windows") {
    file = File.openDialog("Open CSV file", csvFilter, false);
  }
  else file = File.openDialog(
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

  const response = constructFileResponse(file);
  return JSON.stringify(response);
};

export const openMediaFile = () => {
  let file: File | null = null;
  if (File.fs === "Windows") {
    file = File.openDialog("Open media file", imageVideoFilter, false);
  }
  else file = File.openDialog(
    "Open media file",
    function (file: File | Folder) {
      if (file instanceof Folder) return true;
      if (file.hidden) return false;
      if (file.name.match(/\.mp4$/i)) return true;
      if (file.type == "MP4 ") return true;
      return false;
    },
    false
  );
  
  const response = constructFileResponse(file);
  return JSON.stringify(response);
}

export interface SaveFileOptions {
  fileName?: string;
  prompt?: string;
  type?: SorcererFile;
}

export const fileFiltersMac = (type: SorcererFile) => {
  switch (type) {
    case "csv":
      return function (file: File) {
        if (file.name.match(/\.csv$/i)) return true;
        if (file.type == "CSV ") return true;
        return false;
      };
    case "video":
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

export const fileFiltersWindows = (type: SorcererFile) => {
  if (type === "csv") return csvFilter;
  if (type === "video") return videoFilter;
  if (type === "audio") return audioFilter;
  if (type === "image") return imageFilter;
  return allFilesFilter;
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