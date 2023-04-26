import extend from "just-extend";
import { project } from "../../../globals/globals";
import { template } from "../../../globals/project/menu";
import set from "just-safe-set";
import get from "just-safe-get";
import stringify from "fast-safe-stringify";

export const isMatch = (
  a: string,
  b: string,
  options?: {
    whitespace?: "i" | "ignore" | "s" | "show";
    case?: "i" | "insensitive" | "s" | "sensitive";
    match?: "exact" | "partial";
  }
): boolean => {
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

export const findPathByKey = (
  obj: GenericObject,
  key?: string,
  options?: { pathInProgress?: string; allFullPaths?: boolean; includes?: string }
): string[] => {
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

export const parseCategoryTitle = (fullTitle: string) => {
  if (typeof fullTitle !== "string") return;
  const matcher = /(?:![A-Z][a-z]*\W*(?:\([\w ]+\))?\W)?(?:\[(.*)\])?\W*(.*)/;
  // const matcher = /(?:\[(.*)\])?\W*(.+)/;
  const [_total, group, title] = fullTitle.match(matcher);
  return { input: fullTitle, group, title };
};

interface TemplateLookup {
  compName?: string;
  layerName?: string;
  fullTitle?: string;
}

interface TemplateValueData extends TemplateLookup {
  value: string;
}

export class TemplateControl {
  menuMap: GenericObject;
  allPaths: string[];

  constructor() {
    this.menuMap = this.mapMenu(template);
    this.allPaths = findPathByKey(this.menuMap, undefined, { allFullPaths: true });

    project.log("Created TemplateControl");
    project.log("===========");
    project.log("All Paths:");
    project.log(stringify(this.allPaths));
    project.log("===========\n");
  }

  mapMenu = function (menu: TabbedPanel) {
    const map = Object.entries(menu);
    const output: GenericObject = {};
    map.forEach(([key, val]) => {
      // If the value is an object
      // then it might be one we want
      if (key !== "parent" && key !== "selection" && typeof val === "object" && !Array.isArray(val) && val !== null) {
        // If it has the key 'ss_type' then we know that it
        // is one of the menu items that we've made visible
        if (val.ss_type) {
          const children = this.mapMenu(val);
          output[key] = children;
          if (Object.keys(children).length === 0) {
            output[key] = val.ss_type;
          }
        }
      }
    });
    return output;
  };

  getTemplatePath = ({ compName, layerName, fullTitle }: TemplateLookup) => {
    if (!layerName && !fullTitle) return;
    const titleInfo = parseCategoryTitle(fullTitle) || { title: layerName, group: compName };
    const titleSansSpace = titleInfo.title.replace(/\W/g, "");

    const paths = this.allPaths.filter((path) => path.includes(titleInfo.group || ""));

    const possiblePaths = paths.filter((path) => {
      path = path.replace(/\W/g, "");
      const titleMatch = new RegExp(titleSansSpace, "i").test(path);
      const groupMatch = titleInfo.group ? new RegExp(titleInfo.group.replace(/\W/g, ""), "i").test(path) : true;

      return titleMatch && groupMatch;
    });

    if (possiblePaths.length > 1) {
      const exactMatch = new RegExp(".|^" + titleSansSpace + ".|$", "i");
      possiblePaths.sort((a) => (exactMatch.test(a) ? -1 : 1));
    }

    if (possiblePaths.length > 0) {
      return possiblePaths[0];
    }
  };

  setTemplateValue = ({ value, compName, layerName, fullTitle }: TemplateValueData) => {
    const path = this.getTemplatePath({ compName, layerName, fullTitle });

    if (!path) return;

    set(template, `${path}.text`, value);

    const templatePart = get(template, path.replace(/\.[^.]+$/, ""));
    if (templatePart.visibilityToggle) {
      (templatePart.visibilityToggle as Checkbox).value = value !== "" && value !== "[none]";
    }
  };

  getTemplateValue = ({ compName, layerName, fullTitle }: TemplateLookup) => {
    const path = this.getTemplatePath({ compName, layerName, fullTitle });

    if (!path) return;

    return get(template, `${path}.text`);
  };
}
