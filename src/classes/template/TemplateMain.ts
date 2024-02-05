import { searchLibrary } from "../../tools/ae";
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
    const folders = searchLibrary(/templates/gi, {type: "Folder"}) as FolderItem[];
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
    const { mds, template, compBtn, queueBtn, renderBtn, title } = createMainDialog();
    this.menuPanel = template;

    this.templates.forEach((template) => {
      template.createMenuTab(this.menuPanel);

      template.editableFields.forEach((field) => {
        template.addFieldToMenu(field);
      });
    });

    mds.show();

    const render = () => {
      this.render(title.text.text);
    };

    compBtn.onClick = render;
    queueBtn.onClick = render;
    renderBtn.onClick = render;
  }

  getOverview() {
    return {
      templates: this.templates.map((template) => template.getOverview()),
    };
  }

  render(title: string) {
    const templateTitle = (this.menuPanel.selection as Tab).text;
    const template = this.templates.find((template) => template.name === templateTitle);
    if (!template) return;

    template.duplicate(title, true);
  }
}
