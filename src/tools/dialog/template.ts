import extend from "just-extend";

export const mapMenu = (menu: TabbedPanel) => {
  const map = Object.entries(menu);
  const output: GenericObject = {};
  map.forEach(([key, val]) => {
    // If the value is an object
    // then it might be one we want
    if (key !== "parent" && key !== "selection" && typeof val === "object" && !Array.isArray(val) && val !== null) {
      // If it has the key 'ss_type' then we know that it
      // is one of the menu items that we've made visible
      if (val.ss_type) {
        const children = mapMenu(val);
        output[key] = children;
        if (Object.keys(children).length === 0) {
          output[key] = val.ss_type;
        }
      }
    }
  });
  return output;
};

// To Do: move these methods to a more sensable file location:
export interface MatchOptions {
  whitespace?: "i" | "ignore" | "s" | "show";
  case?: "i" | "insensitive" | "s" | "sensitive";
  match?: "exact" | "partial";
}

export const isMatch = (a: string, b: string, options?: MatchOptions): boolean => {
  if (typeof a !== "string" || typeof b !== "string") return false;
  options = extend({}, { case: "i", whitespace: "s" }, options);
  if (options.whitespace === "i" || options.whitespace === "ignore") {
    a = a.replace(/\W/g, "");
    b = b.replace(/\W/g, "");
  }
  if (options.case === "i" || options.case === "insensitive") {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }
  if (options.match === "partial") {
    return a.includes(b);
  }
  return a === b;
};

export interface FindPathOptions {
  pathInProgress?: string;
  allFullPaths?: boolean;
  includes?: string;
}

export const findPathByKey = (obj: GenericObject, key?: string, options?: FindPathOptions): string[] => {
  options = extend({}, { pathInProgress: "" }, options);
  const entries = Object.entries(obj);
  const output = [];
  entries.forEach(([k, v]) => {
    if (isMatch(k, key)) {
      output.push(`${options.pathInProgress}${k}`);
    }

    if (typeof v === "object") {
      const path = options.pathInProgress + (Array.isArray(obj) ? `[${k}].` : `${k}.`);
      const newOptions = extend({}, options, { pathInProgress: path });
      const result = findPathByKey(v, key, newOptions);
      output.push(...result);
    } else if (options.allFullPaths) {
      output.push(`${options.pathInProgress}${k}`);
    }
  });

  const filtered = options.includes ? output.filter((path) => new RegExp(options.includes, "i").test(path)) : output;
  return filtered;
};

export const getFilePaths = (obj: GenericObject): string[] => {
  return findPathByKey(obj, undefined, { allFullPaths: true });
};

export const parseCategoryTitle = (fullTitle: string) => {
  if (typeof fullTitle !== "string") return;
  // const matcher = /(?:![A-Z][a-z]*\s*(?:\([\w ]+\))?\s)?(?:\[(.*)\])?\s*(.*)/;
  let title = fullTitle;

  const typeMatch = /!([A-Z])([a-z]*)/;
  const groupMatch = /(?:\[(.*)\])/;
  const sectionMatch = /(?:\((.*)\))/;

  const [_typeMatch, type, subtype] = title.match(typeMatch) || [];
  title = title.replace(typeMatch, "").trim();

  const [_groupMatch, group] = title.match(groupMatch) || [];
  title = title.replace(groupMatch, "").trim();

  const [_sectionMatch, section] = title.match(sectionMatch) || [];
  title = title.replace(sectionMatch, "").trim();

  return { input: fullTitle, type, subtype, group, section, title };
};