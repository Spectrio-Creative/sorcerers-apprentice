// import { createSSNamespace } from "./main";
// import { saveFile } from "./tools/fs";
import { queueInAME } from "./tools/ame";
import { searchLibrary } from "./tools/project";

// Get comp titled 'Fish Test' from project.
const comp = searchLibrary(/Fish/gi, { type: "Composition", recursive: true }) as CompItem[];

if (comp.length === 0) throw new Error("Comp not found.");


// const projectPath = app.project.file.fsName;
// alert(`Project path: ${projectPath}`);
// // alert(`app.project.file.name: ${app.project.file.name}
// // app.project.file.lineFeed: ${app.project.file.lineFeed}
// // app.project.file.fsName: ${app.project.file.fsName}`);


// const jsonFile = new File("/Volumes/Moomintroll/Test/formats.json");
// alert(`jsonFile.fsName: ${jsonFile.fsName}`);

// const source = "~/Desktop/IMG_2856.jpeg";
// const testFile = new File(source);
// alert(`File name:\n${testFile.fsName}`);

queueInAME(comp);

// const renderQueueItem = app.project.renderQueue.items.add(comp[0]);

// // renderQueueItem.outputModule(1).applyTemplate("H.264 - Match Render Settings - 15 Mbps");
// renderQueueItem.outputModule(1).file = file;

// renderQueueItem.outputModule(1).applyTemplate("Lossless");
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
