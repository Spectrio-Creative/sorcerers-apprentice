import extend from "just-extend";
import { parseTabTitle } from "../../../tools/library/sorcererDictionary";

const tabDefaultKeys = [
  ...["name", "alignChildren", "orientation", "selection", "titleLayout", "title", "active"],
  ...["justify", "graphics", "visible", "maximumSize", "minimumSize", "preferredSize"],
  ...["windowBounds", "children", "layout", "margins", "spacing", "alignment", "enabled"],
  ...["helpTip", "parent", "textDirection", "window", "type"],
];

const createTemplate = (templateTab) => {
  let parsedTitle = parseTabTitle(templateTab.name);
  const contentKey = `content_${parsedTitle.title}`;
  if (!templateTab[contentKey]) return;

  const template = extend(templateTab, {
    originalRef: templateTab,
    contentKey,

    input_title: parsedTitle.input,
    title: parsedTitle.title,
    id: parsedTitle.id,
    groupNames: [],
    tabs: {},

    tabLengthValidated: false,

    updateTabs: function () {
      const entries = Object.entries(this.originalRef[this.contentKey]);
      const groups = [];
      const tabs = {};
      entries.forEach((key, value) => {
        if (!tabDefaultKeys.includes(key) && value.type === "tab") {
          groups.push(key);
          tabs[key] = value;
        }
      });
      this.groupNames = groups;
      this.tabs = tabs;
    },

    validateTabLength: function () {
      const valid = this.originalRef.children.length === this.groupNames.length;
      this.tabLengthValidated = valid;
      return valid;
    },
  });

  template.updateTabs();

  return template;
};

export { createTemplate };
