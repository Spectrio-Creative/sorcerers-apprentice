import { writeBMPFile } from "./play";

export function writeFormatsJSON(jsonLocation: File | string = "~/formats.json"): string {
  const jsonFile = (typeof jsonLocation === "string") ? new File(jsonLocation) : jsonLocation;

  // @ts-ignore
  const encoder = app.getEncoderHost();
  const formats = encoder.getFormatList();
  // alert(`Formats: ${JSON.stringify(formats)}`);

  // @ts-ignore
  const frontend = app.getFrontend();

  // Example usage
  const filePath = "~/red.bmp";
  const width = 16;
  const height = 9;
  const color = [255, 0, 0] as [number, number, number]; // Red color

  const file = new File(filePath);
  if (!file.exists) {
    writeBMPFile(filePath, width, height, color);
  }

  const encoderWrapper = frontend.addFileToBatch(file.fsName, "H.264", "Match Source - High bitrate");
  const formatJSON = {};

  // Loop through all the formats and presets
  for (const format of formats) {
    // const presets = encoder.getPresets(format);
    encoderWrapper.loadFormat(format);
    const presets  = [];
    const list = encoderWrapper.getPresetList();
    for (const preset of list) {
      const breakPoint = preset.indexOf("#");
      const presetName = preset.substring(breakPoint + 1);
      presets.push(presetName);
    }
    formatJSON[format] = presets;
  }

  // encoderWrapper.remove();
  // @ts-ignore
  const exporter = app.getExporter();
  exporter.removeAllBatchItems();
  file.remove();

  const simpleStringify = (obj: AMEFormats): string => {
    let str = "{";
    for (const key in obj) {
      str += '"' + key + '": [ ';
      for (const item of obj[key]) {
        str += '"' + item + '",';
      }
      // Remove the trailing comma
      str = str.slice(0, -1);
      str += " ],";
    }
    // Remove the trailing comma
    str = str.slice(0, -1);
    str += "}";
    return str;
  };

  // Save the JSON to a file
  jsonFile.open("w");
  jsonFile.write('{ "timestamp": "' + new Date() + '", "formats": ' + simpleStringify(formatJSON) + "}");
  jsonFile.close();

  return jsonFile.fsName;
}