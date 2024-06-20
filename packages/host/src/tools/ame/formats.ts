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
  alert(`EncoderWrapper: ${JSON.stringify(!!encoderWrapper)}`);
  const formatJSON = {};

  // Loop through all the formats and presets
  for (const format of formats) {
    // const presets = encoder.getPresets(format);
    encoderWrapper.loadFormat(format);
    const presets = encoderWrapper.getPresetList().map((preset: string) => {
      // The presets are sometimes formatted like "9bb57b43-b3d1-448f-bdb0-4c5e3dcf9750#Match Source - High bitrate"
      // We only want the name of the preset without the GUID.
      // If there are multiple # characters, we only want to split on the first one.

      const breakPoint = preset.indexOf("#");
      const presetName = preset.substring(breakPoint + 1);
      // const guid = preset.substring(0, breakPoint);
      return presetName;
    });
    formatJSON[format] = presets;
  }

  // encoderWrapper.remove();
  // @ts-ignore
  const exporter = app.getExporter();
  exporter.removeAllBatchItems();
  file.remove();

  // Save the JSON to a file
  jsonFile.open("w");
  jsonFile.write(JSON.stringify(formatJSON));
  jsonFile.close();

  return jsonFile.fsName;
}