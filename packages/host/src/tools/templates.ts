import { TemplateOptions } from "../classes/template/Template";
import { FieldBaseOptions } from "../classes/template/field/Field";
import { searchComp } from "./project";

export const findTemplatesInFolders = (folders: FolderItem[]): TemplateOptions[] => {
  const templateFolders = [] as TemplateOptions[];
  folders.forEach((folder) => {
    for (let i = 1; i <= folder.items.length; i++) {
      if (folder.items[i].typeName == "Composition" && folder.items[i].name === folder.name) {
        const comp = folder.items[i] as CompItem;

        if (searchComp(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, comp, { recursive: true })?.length > 0) {
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

export const parseLayerName = (name: string, permissive = false) => {
  const testType = "^!([A-Z])([a-z]*)\\s*";
  const testTag = "\\((.*)\\)";
  const testTab = "\\[(.*)\\]";
  const testStrings = [
    `${testType}\\s*${testTag}\\s*${testTab}`,
    `${testType}\\s*${testTag}`,
    `${testType}(\\s*)${testTab}`,
    `${testType}`
  ];

  if (permissive) {
    testStrings.push(...[`(\\s*)${testTag}\\s*${testTab}`, `(\\s*)(\\s*)${testTag}`, `(\\s*)${testTab}`]);
  }

  let match: RegExpMatchArray | string[];
  for (let i = 0; i < testStrings.length; i++) {
    const test = new RegExp(testStrings[i]);
    match = name.match(test);
    if (match) break;
  }

  if (!match && permissive) match = [""];
  if (!match) return;
  // Fill in empty matches
  while(match.length < 5) match.push("");

  const [fullMatch, typeAbbreviation, optionString, tag, tab] = match.map((m) => (m || "").trim());

  const title = name.replace(fullMatch, "").trim();

  const type = fieldTypeMap[typeAbbreviation] || "";

  const options = (optionString || "")
    .split("")
    .map((option) => fieldOptionMap[option])
    .filter((option) => !!option);

  return { type, options, tab, tag, title } as FieldBaseOptions;
};

export const fieldTypeMap: { [key: string]: FieldType } = {
  T: "Text",
  A: "Audio",
  I: "Media",
  V: "Media",
  M: "Media",
  C: "Color",
  G: "Group",
  F: "Font",
};

export const fieldOptionMap: { [key: string]: FieldOption } = {
  v: "visible",
  b: "background-size",
  f: "fill-size",
  n: "no-scale",
  s: "scale-down",
  l: "linked-subtag",
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
