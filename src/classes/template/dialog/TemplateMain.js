import { project } from "../../../globals/globals";
import { parseTabTitle, templateTabReg } from "../../../tools/library/sorcererDictionary";
import { createTemplate } from "./Template";

const createTemplateMain = (template) => {
  const templateMain = {
    originalRef: template,
    templateNames: [],
    templates: {},

    updateTabs: function () {
      const keys = Object.keys(this.originalRef);
      keys.forEach((key) => {
        if (templateTabReg.test(key)) {
          project.log(`Key: ${key}`);
          this.templateNames.push(key);
          const title = parseTabTitle(key);
          this.templates[title.title] = createTemplate(this.originalRef[(key, title)]);
        }
      });
    },
  };

  templateMain.updateTabs();

  return templateMain;
};

export { createTemplateMain };
