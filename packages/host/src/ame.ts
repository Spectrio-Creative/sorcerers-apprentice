// // import { createSSNamespace } from "./main";
// import { saveFile } from "./tools/fs";
// import { searchLibrary } from "./tools/project";

import { writeBMPFile } from "./tools/play";

// // const ss = createSSNamespace();

// const file = saveFile(undefined, { type: "mp4" });

// // Get comp titled 'Fish Test' from project.
// const comp = searchLibrary(/Fish Test/gi, { type: "Composition", recursive: true }) as CompItem[];

// if (comp.length === 0) throw new Error("Comp not found.");

// // Remove all existing items from the render queue.
// for (let i = app.project.renderQueue.items.length; i > 0; i--) {
//   app.project.renderQueue.item(i).remove();
// }

// const renderQueueItem = app.project.renderQueue.items.add(comp[0]);

// // renderQueueItem.outputModule(1).applyTemplate("H.264 - Match Render Settings - 15 Mbps");
// renderQueueItem.outputModule(1).file = file;

// renderQueueItem.outputModule(2).applyTemplate("Lossless");
// // renderQueueItem.outputModule(2).file = new File(file.fsName.replace(".mp4", "_2.mov"));

// if (app.project.renderQueue.items.length === 0) {
//   alert("There are no queued items in the Render Queue.");
// } else if (app.project.renderQueue.canQueueInAME == true) {
//   app.project.renderQueue.queueInAME(false);
//   // Add the comp to the render queue.
//   //   app.project.renderQueue.
//   // Send queued items to AME, but do not start rendering.
//   //app.project.renderQueue.queueInAME(true);
//   //   app.project.renderQueue.
// } else {
//   alert("There are no queued items in the Render Queue.");
// }

// Ignore all typescript errors below this line.
/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unused-vars */

// @ts-ignore
const encoder = app.getEncoderHost();
const formats = encoder.getFormatList();
// alert(`Formats: ${JSON.stringify(formats)}`);

// @ts-ignore
const frontend = app.getFrontend();

// const source = "/Volumes/Moomintroll/Golden Light - Video EP/B-Roll/MVI_3934.MOV";
// const source = "~/Desktop/IMG_2856.jpeg";

// Example usage
const filePath = "/Volumes/Moomintroll/Test/red.bmp";
const width = 16;
const height = 9;
const color = [255, 0, 0] as [number, number, number]; // Red color

const file = new File(filePath);
if (!file.exists) {
  writeBMPFile(filePath, width, height, color);
}

const encoderWrapper = frontend.addFileToBatch(filePath, "H.264", "Match Source - High bitrate");
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

// Save the JSON to a file
const jsonFile = new File("/Volumes/Moomintroll/Test/formats.json");
jsonFile.open("w");
jsonFile.write(JSON.stringify(formatJSON));
jsonFile.close();

alert(`Formats and presets written to: ${jsonFile.fsName}`);

// // @ts-ignore
// const exporter = app.getExporter();

// function itemAdded(eventObj) {
//   const keys = Object.keys(eventObj);
//   let message = "";
//   for (const key of keys) {
//     const keyType = typeof eventObj[key];
//     switch (keyType) {
//       case "string":
//       case "number":
//       case "boolean":
//         message += `${key}: ${eventObj[key]}\n`;
//         break;
//       case "object":
//         message += `${key}: ${JSON.stringify(eventObj[key])}\n`;
//         message += `${key}.outputFiles: ${JSON.stringify(eventObj[key].outputFiles)}\n`;
//         message += `${key}.audioInfo: ${JSON.stringify(eventObj[key].audioInfo)}\n`;
//         break;
//       default:
//         message += `${key}: ${keyType}\n`;
//         break;
//     }
//   }
//   const targetKeys = Object.keys(eventObj.target);
//   alert(`Item added to batch: ${JSON.stringify(keys)}\n${message}`);
//   frontend.removeEventListener(eventObj.type, itemAdded);
// }
// // frontend.addEventListener("onItemAddedToBatch", itemAdded);
// // frontend.addEventListener("onBatchItemCreation", itemAdded);
// // exporter.addEventListener("onBatchItemStatusChanged", itemAdded);

// const projectPath = "/Users/innocentsmith/Creative Cloud Files/Sorcerer's Script/Sorcerer Test 2.aep";
// // const guids = frontend.getDLItemsAtRoot(projectPath);

// // alert(`Items at root: ${JSON.stringify(guids)}`);

// // const item = frontend.addFileToBatch(
// //   "/Users/innocentsmith/Creative Cloud Files/Sorcerer's Script/movement_demo.mp4",
// //   "H.264",
// //   "Match Source - High bitrate"
// // );
// // alert(`Item added to batch: ${JSON.stringify(item)}`);
// // "Match Source - High bitrate",
// // "Twitter 640x640",

// const guids = ["00000079-0000-0000-0000-000000000000","0000435f-0000-0000-0000-000000000000","00004394-0000-0000-0000-000000000000","000043c9-0000-0000-0000-000000000000","000043fe-0000-0000-0000-000000000000","00004433-0000-0000-0000-000000000000","0000444a-0000-0000-0000-000000000000","00004458-0000-0000-0000-000000000000"];

// function addLinkComp(guid: string) {
//   const item = frontend.addDLToBatch(
//     projectPath,
//     "H.264",
//     // "Match Source - High bitrate",
//     "Twitter 640x640",
//     guid
//   );
//   // const success = item !== null;
//   // alert(`Item added to batch: ${success} (${guid})`);
// }

// for (const guid of guids) {
//   addLinkComp(guid);
// }
