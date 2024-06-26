export async function saveFile(
  data?: string,
  type: SorcererFile = "other"
): Promise<FileResponse> {
  return new Promise((resolve, _reject) => {
    // Select file from browser dialog to simulate the host
    if (!data) {
      let response = {
        status: "OK",
        file: "C:/Users/username/Documents/Project/file.txt",
        filePath: "C:/Users/username/Documents/Project/",
        fileName: "file.txt",
      };

      if (type === "video") {
        response = {
          status: "OK",
          file: "C:/Users/username/Documents/Project/video.mp4",
          filePath: "C:/Users/username/Documents/Project/",
          fileName: "video.mp4",
        };
      }

      resolve(response as FileResponseOK);
      return;
    }

    // Save file to simulate the host
    const blobType = type === "csv" ? "text/csv" : type === "video" ? "video/mp4" : "text/plain";
    const blob = new Blob([data], { type: blobType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const extension = type === "other" ? "txt" : type;
    a.href = url;
    a.download = `file.${extension}`;
    a.click();

    resolve({
      status: "OK",
      file: `C:/Users/username/Documents/Project/file.${extension}`,
      filePath: "C:/Users/username/Documents/Project/",
      fileName: `file.${extension}`,
    });
  });
}

export async function selectFile(_type: SorcererFile = "other"): Promise<{
  status: string;
  file: string;
  filePath: string;
  fileName: string;
}> {
  return new Promise((resolve, _reject) => {
    // Select file from browser dialog to simulate the host
    resolve({
      status: "OK",
      file: "C:/Users/username/Documents/Project/file.txt",
      filePath: "C:/Users/username/Documents/Project/",
      fileName: "file.txt",
    });
  });
}
