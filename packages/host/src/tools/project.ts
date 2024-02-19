import { asRegEx } from "./regex";

// FIND LIBRARY ITEMS BY NAME OR REGEX
// iType = the desired file type
// maxResult = the maximum results in the array. If 1, the object is returned instead of an array
// ====

// This is locale-specific, so it's important to test it in the target locale
export type ItemType = "Folder" | "Footage" | "Composition" | string;

export interface LibrarySearchOptions {
  type?: ItemType;
  maxResult?: number;
  parent?: FolderItem;
  recursive?: boolean;
  searchKey?: "name" | "id";
  strict?: boolean;
}

const defaultOptions: () => LibrarySearchOptions = () => ({
  type: undefined,
  maxResult: Number.POSITIVE_INFINITY,
  parent: app.project.rootFolder,
  recursive: true,
  searchKey: undefined,
  strict: false,
});

export function searchLibrary(search: RegExp | string | number, options: LibrarySearchOptions = defaultOptions()) {
  const { type, maxResult, parent, recursive, searchKey } = { ...defaultOptions(), ...options };
  const searcher = searchKey || (typeof search === "number" ? "id" : "name");

  //Ensure that reg is a regular expression
  search = asRegEx(search, { strict: options.strict });

  const results: _ItemClasses[] = [];

  for (let i = 1; i <= parent.items.length; i++) {
    const item = parent.items[i];
    if (search.test(`${item[searcher]}`)) {
      if (type === undefined || type === item.typeName) {
        if (maxResult === 1) return [item];
        results.push(item);
      }
    }

    if (results.length === maxResult) break;

    if (!recursive || !(item instanceof FolderItem)) continue;

    const innerResults = searchLibrary(search, { ...options, parent: item });

    // If the inner results are less than the max result, add them to the results array
    while (results.length < maxResult && innerResults.length > 0) {
      results.push(innerResults.shift());
    }
  }

  return results;
}

export interface CompSearchOptions {
  maxResult?: number;
  recursive?: boolean;
  strict?: boolean;
  stringSearch?: boolean;
}

const defaultCompOptions: CompSearchOptions = {
  maxResult: Number.POSITIVE_INFINITY,
  recursive: false,
  strict: false,
  stringSearch: true,
};

export function searchComp(
  search: RegExp | string | number,
  comp: CompItem,
  options: CompSearchOptions = defaultCompOptions
) {
  const { maxResult, recursive } = { ...defaultCompOptions, ...options };
  search = asRegEx(search, options);

  const results: Layer[] = [];

  for (let i = 1; i <= comp.numLayers; i++) {
    const layer = comp.layer(i);
    if (search.test(`${layer.name}`)) {
      if (maxResult === 1) return [layer];
      results.push(layer);
    }

    if (results.length === maxResult) break;

    const source = (layer as AVLayer).source;
    if (!recursive || !(source instanceof CompItem)) continue;

    const innerResults = searchComp(search, source, options);

    while (results.length < maxResult && innerResults.length > 0) {
      results.push(innerResults.shift());
    }
  }

  return results;
}

export function copyFolderContents(input: FolderItem, output: FolderItem) {
  for (let i = 1; i <= input.numItems; i++) {
    const item = input.item(i);
    if (item instanceof FolderItem) {
      const newFolder = output.items.addFolder(item.name);
      copyFolderContents(item, newFolder);
    } else if (item instanceof CompItem) {
      const newComp = item.duplicate();
      newComp.parentFolder = output;
      newComp.name = item.name;
    } else {
      alert(`Could not copy ${item.name} to folder ${output.name}.`);
    }
  }
}

export function openComps() {
  const comps = [];
  do {
    comps.unshift(app.project.activeItem);
    app.executeCommand(app.findMenuCommandId("Close"));
  } while (app.project.activeItem != null && app.project.activeItem instanceof CompItem);

  for (let i = 0; i < comps.length; i++) {
    comps[i].openInViewer();
  }

  return comps;
}

export function allCompsFromFolder(folder: FolderItem) {
  const results: CompItem[] = [];

  for (let i = 1; i <= folder.numItems; i++) {
    const item = folder.item(i);
    if (item instanceof CompItem) {
      results.push(item);
    }
    if (item instanceof FolderItem) {
      results.push(...allCompsFromFolder(item));
    }
  }

  return results;
}