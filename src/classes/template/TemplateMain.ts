import { libItemsReg } from "../../tools/ae";
import { findTemplatesInFolders } from "../../tools/templates";
import { createMainDialog } from "../MainDialog";
import { Template } from "./Template";

export interface TemplateTab {
  id: string;
  name: string;
  ss_type: string;
  alignChildren: _AlignmentProperty;
  preferredSize: Dimension;
  margins: Margins;
  alignment: _AlignmentProperty;
}

export class TemplateMain {
  tabs: TemplateTab[] = [];
  templates: Template[];
  menuPanel: TabbedPanel;

  constructor() {
    this.tabs = [];
    this.findTemplateFolders();
  }

  findTemplateFolders() {
    const folders = libItemsReg(/templates/gi, "Folder") as FolderItem[];
    this.templates = findTemplatesInFolders(folders).map((template) => new Template(template));
  }

  printNames() {
    let templates = "";
    this.templates.forEach((template) => {
      templates += `Template ${template.name}\n`;

      template.editableFields.forEach((field) => {
        templates += `Field ${field.title} | ${field.type} | ${field.tab}\n`;
      });

      templates += "\n";
    });

    return templates;
  }

  createMenuPanel() {
    const { mds, template } = createMainDialog();
    this.menuPanel = template;

    mds.show();
  }

  getOverview() {
    return {
      templates: this.templates.map((template) => template.getOverview()),
    };
  }
}
