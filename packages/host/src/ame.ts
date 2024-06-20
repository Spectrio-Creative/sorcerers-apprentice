// // import { createSSNamespace } from "./main";
// import { saveFile } from "./tools/fs";
// import { searchLibrary } from "./tools/project";

import { writeFormatsJSON } from "./tools/ame/formats";

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

writeFormatsJSON();

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
