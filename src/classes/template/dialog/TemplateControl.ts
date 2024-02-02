import { project } from "../../../globals/project/project";
import { template } from "../../../globals/project/menu";
import set from "just-safe-set";
import get from "just-safe-get";
import { findPathByKey, parseCategoryTitle } from "../../../tools/dialog/template";

interface TemplateLookup {
  compName?: string;
  layerName?: string;
  fullTitle?: string;
  template?: string;
}

interface TemplateValueData extends TemplateLookup {
  value: string;
}

export class TemplateControl {
  menuMap: GenericObject;
  allPaths: string[];

  // constructor() {}

  init = function () {
    this.menuMap = this.mapMenu(template);
    this.allPaths = findPathByKey(this.menuMap, undefined, { allFullPaths: true });

    project.log("Created TemplateControl");
    project.log("===========");
    project.log("All Paths:");
    project.log(this.allPaths.reducer((t, c) => `${t}\n${c}`));
    project.log("===========\n");
  };

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

  getTemplatePath = ({ compName, layerName, fullTitle, template }: TemplateLookup) => {
    if (!layerName && !fullTitle) return;
    const titleInfo = parseCategoryTitle(fullTitle) || { title: layerName, group: compName };
    const titleSansSpace = titleInfo.title.replace(/\s/g, "");

    const paths = template ? this.allPaths.filter((path) => path.includes(template.replace(/\W/g, ""))) : this.allPaths;

    const possiblePaths = paths.filter((path) => {
      path = path.replace(/\s/g, "");
      const titleMatch = new RegExp(titleSansSpace, "i").test(path);
      const groupMatch = titleInfo.group ? new RegExp(titleInfo.group.replace(/\s/g, ""), "i").test(path) : true;

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

  setTemplateValue = (input: TemplateValueData) => {
    const path = this.getTemplatePath(input);
    const value = input.value;
    if (!path) return;

    set(template, `${path}.text`, value);

    const templatePart = get(template, path.replace(/\.[^.]+$/, ""));
    if (templatePart.visibilityToggle) {
      (templatePart.visibilityToggle as Checkbox).value = value !== "" && value !== "[none]";
    }
  };

  getTemplateValue = (input: TemplateLookup) => {
    const path = this.getTemplatePath(input);
    if (!path) return;

    return get(template, `${path}.text`);
  };
}
