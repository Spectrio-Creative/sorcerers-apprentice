import { fontLibrary } from "../../globals/project/fontLibrary";
import { mediaLibrary } from "../../globals/project/mediaLibrary";
import { searchLibrary } from "../../tools/project";
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

export interface PanelElements {
  mds: Window;
  header: Group;
  title: TextGroup;
  outFolder: ButtonGroup;
  template: TabbedPanel;
  options: Group;
  compBtn: Button;
  queueBtn: Button;
  renderBtn: Button;
  divider1: Panel;
  stts: Group;
  pbar: Progressbar;
  status: StaticText;
}

export class TemplateMain {
  tabs: TemplateTab[] = [];
  templates: Template[];
  menuPanel: TabbedPanel;
  panelEls: PanelElements;

  constructor() {
    this.tabs = [];
    this.findTemplateFolders();
  }

  findTemplateFolders() {
    const folders = searchLibrary(/templates/gi, { type: "Folder" }) as FolderItem[];
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

  showMenuPanel() {
    this.panelEls = createMainDialog();
    this.menuPanel = this.panelEls.template;

    this.templates.forEach((template) => {
      template.createMenuTab(this.menuPanel);

      template.editableFields.forEach((field) => {
        template.addFieldToMenu(field);
      });
    });

    this.panelEls.mds.show();

    const render = () => {
      this.render(this.panelEls.title.input.text);
    };

    this.panelEls.compBtn.onClick = render;
    this.panelEls.queueBtn.onClick = render;
    this.panelEls.renderBtn.onClick = render;
  }

  refresh() {
    this.templates = [];
    this.findTemplateFolders();

    this.templates.forEach((template) => {
      template.refresh();
    });
  }

  getOverview() {
    this.refresh();
    fontLibrary.refresh();
    mediaLibrary.refresh();
    return {
      templates: this.templates.map((template) => template.getOverview()),
      fonts: fontLibrary.projectFonts,
      libraryAssets: mediaLibrary.mediaItems,
    };
  }

  setValuesFromList(list: InputTemplateValue[]) {
    list.forEach((template) => {
      const found = this.templates.find((t) => t.name === template.templateName);
      if (found) {
        const tempChild = found.duplicate(template.compName);
        tempChild.fillValues(template.fields);
      }
    });
  }

  render(title: string) {
    const templateTitle = (this.menuPanel.selection as Tab).text;
    const template = this.templates.find((template) => template.name === templateTitle);
    if (!template) return;

    template.duplicate(title || templateTitle, true);

    // alert("finished");

    this.panelEls.status.text = "Script Finished";
    this.panelEls.compBtn.active = true;
    this.panelEls.compBtn.active = false;
    this.panelEls.renderBtn.enabled = false;
    this.panelEls.compBtn.text = "DONE";
    this.panelEls.queueBtn.text = "RESET";
    this.panelEls.renderBtn.text = "TOTAL RESET";

    const original = this.panelEls.compBtn.onClick;

    this.panelEls.compBtn.onClick = () => {
      this.panelEls.mds.close();
    };

    this.panelEls.queueBtn.onClick = () => {
      this.panelEls.compBtn.onClick = original;
      this.panelEls.queueBtn.onClick = original;
      this.panelEls.renderBtn.onClick = original;

      // Change the text back
      this.panelEls.compBtn.text = "Render";
      this.panelEls.queueBtn.text = "Queue";
      this.panelEls.renderBtn.text = "Render All";
    };
  }
}
