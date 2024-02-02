import type { TemplateOptions } from "../classes/template/Template";
import { FieldBaseOptions, FieldOption, FieldType } from "../classes/template/field/Field";
import { findLayers, libItemsInFolder } from "./ae";

export const findTemplatesInFolders = (folders: FolderItem[]): TemplateOptions[] => {
  const templateFolders = [] as TemplateOptions[];
  folders.forEach((folder) => {
    for (let i = 1; i <= folder.items.length; i++) {
      if (folder.items[i].typeName == "Composition" && folder.items[i].name === folder.name) {
        const compArr = libItemsInFolder(folder.name, folder, "Composition") as CompItem[];

        if (compArr.length > 0 && findLayers(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, compArr[0]).length > 0) {
          templateFolders.push(
            ({
              name: folder.name,
              id: folder.id,
              comp: folder.items[i] as CompItem,
              folder: folder,
            })
          );
        }
      }

      if (folder.items[i].typeName == "Folder") {
        templateFolders.push(...findTemplatesInFolders([folder.items[i] as FolderItem]));
      }
    }
  });
  return templateFolders;
};

export const parseLayerName = (name: string) => {
  const withGroupAndTab = /^!([A-Z])([a-z]*)\s*\((.*)\)\s*\[(.*)\]/;
  const withGroup = /^!([A-Z])([a-z]*)\s*\((.*)\)/;
  const withTab = /^!([A-Z])([a-z]*)(\s*)\[(.*)\]/;
  const withoutGroup = /^!([A-Z])([a-z]*)/;
  let match = name.match(withGroupAndTab);
  if (!match) match = name.match(withGroup);
  if (!match) match = name.match(withTab);
  if (!match) match = name.match(withoutGroup);
  if (!match) return;

  const title = name.replace(match[0], "").trim();

  const [_match, typeAbbreviation, optionString, group, tab] = match;

  const type = fieldTypeMap[typeAbbreviation];

  const options = (optionString || "")
    .split("")
    .map((option) => fieldOptionMap[option])
    .filter((option) => !!option);

  return { type, options, tab: (tab || "").trim(), group: group || "", title: title || "" } as FieldBaseOptions;
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
