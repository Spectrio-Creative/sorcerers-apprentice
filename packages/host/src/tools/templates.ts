import { TemplateOptions } from "../classes/template/Template";
import { searchComp } from "./project";

export const findTemplatesInFolders = (folders: FolderItem[]): TemplateOptions[] => {
  const templateFolders = [] as TemplateOptions[];
  folders.forEach((folder) => {
    for (let i = 1; i <= folder.items.length; i++) {
      if (folder.items[i].typeName == "Composition" && folder.items[i].name === folder.name) {
        const comp = folder.items[i] as CompItem;

        const templateLayers = searchComp(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, comp, { recursive: true });
        if (templateLayers?.length > 0) {
          templateFolders.push({
            name: folder.name,
            id: folder.id,
            comp: folder.items[i] as CompItem,
            folder: folder,
          });
        }
      }

      if (folder.items[i].typeName == "Folder") {
        templateFolders.push(...findTemplatesInFolders([folder.items[i] as FolderItem]));
      }
    }
  });
  return templateFolders;
};

export const parseColorLayer = (layer: Layer): Property[] => {
  const effects = layer("Effects") as PropertyGroup;

  const colorEffects = [] as Property[];

  for (let i = 0; i < effects.numProperties; i++) {
    const effect = effects.property(i + 1);
    if (effect.matchName !== "ADBE Color Control") continue;
    colorEffects.push(effect as Property);
  }

  return colorEffects;
};
