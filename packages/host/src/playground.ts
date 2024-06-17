// import { createSSNamespace } from "./main";
// import { saveFile } from "./tools/fs";
import { queueInAME } from "./tools/ame";
import { savePresetsJSON } from "./tools/ame/presetsCompiled";
import { searchLibrary } from "./tools/project";

// Get comp titled 'Fish Test' from project.
const comp = searchLibrary(/Fish/gi, { type: "Composition", recursive: true }) as CompItem[];

if (comp.length === 0) throw new Error("Comp not found.");

savePresetsJSON({
  callback: (filePath: string) => {
    alert(filePath);
  },
  jsonLocation: "~/Desktop/presets.json",
});
// queueInAME(comp);
