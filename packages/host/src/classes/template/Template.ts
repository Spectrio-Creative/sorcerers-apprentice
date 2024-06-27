import { addTab, addTabbedPannel } from "../../pluginTools/dialogElements";
import { allCompsFromFolder, searchComp, searchLibrary } from "../../tools/project";
import { log, systemRoot } from "../../tools/system";
import { TemplateChild } from "./TemplateChild";
import { FieldBase } from "./field/Field";
import { makeFieldBase } from "./field/makeFieldBase";

export interface TemplateOptions {
  name?: string;
  id?: number;
  comp: CompItem;
  folder: FolderItem;
  editableFields?: FieldBase[];
}

export class Template {
  name: string;
  id: number;
  comp: CompItem;
  folder: FolderItem;
  editableFields: FieldBase[];
  menuTab: Tab;
  menuPanel: TabbedPanel;
  innerTabs: { [key: string]: Tab } = {};
  children: TemplateChild[] = [];

  constructor(options: TemplateOptions) {
    this.comp = options.comp;
    this.folder = options.folder;
    this.name = options.name || this.folder.name;
    this.id = options.id || this.folder.id;
    this.editableFields = options.editableFields || [];

    this.getEditableFields();
  }

  getEditableFields() {
    const compFolder = this.folder;
    const comps = allCompsFromFolder(compFolder);

    comps.forEach((comp) => {
      const editableLayers = searchComp(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, comp, { recursive: false }) as Layer[];

      editableLayers.forEach((layer) => {
        this.editableFields.push(...makeFieldBase(layer));
      });
    });
  }

  createMenuTab(mainTab: TabbedPanel) {
    this.menuTab = mainTab.add(addTab(this.name) as "tab") as Tab;
    this.menuPanel = this.menuTab.add(addTabbedPannel(this.name) as "tabbedpanel") as TabbedPanel;
  }

  addInnerTab(tabName: string) {
    const tab = this.menuPanel.add(addTab(tabName) as "tab") as Tab;
    this.innerTabs[tabName] = tab;
    return tab;
  }

  addFieldToMenu(field: FieldBase) {
    const tabName = field.tab || `${field.type} Fields`;

    if (!this.innerTabs[tabName]) {
      this.addInnerTab(tabName);
    }

    field.createMenuField(this.innerTabs[tabName]);
  }

  userCompsOrTemplatesHasName(name: string) {
    const result = searchLibrary(/^User Comps|^Templates/g, { type: "Folder", recursive: false }) as FolderItem[];
    const items = [];
    result.forEach((folder) => {
      for (let i = 1; i <= folder.numItems; i++) {
        items.push(folder.item(i));
      }
    });

    return items.some((item) => item.name === name);
  }

  duplicate(name: string, fillValues = false) {
    const result = searchLibrary(/^User Comps/g, { type: "Folder", recursive: false }) as FolderItem[];
    const userComps = result[0] || app.project.items.addFolder("User Comps");

    // Insure the name is unique
    let newName = name;
    let i = 1;
    while (this.userCompsOrTemplatesHasName(newName)) {
      newName = `${name} ${i}`;
      i++;
    }

    const newFolder = userComps.items.addFolder(newName);
    const templateChild = new TemplateChild(newFolder, this);
    this.children.push(templateChild);

    if (fillValues) templateChild.fillValues();

    return templateChild;
  }

  getOverview(logs = false) {
    const editableOverview = this.editableFields.map((field) => {
      const fieldOverview = field.getOverview();
      return fieldOverview;
    });
    logs && log(`Overview (${this.name}): ${JSON.stringify(editableOverview)}`);
    const defaultOutputFile = systemRoot.createProjectRootFile(`${this.name}.mp4`);
    
    let defaultOutput = defaultOutputFile.fsName;
    if (systemRoot.osName === "mac") defaultOutput = defaultOutputFile.absoluteURI;

    return {
      name: this.name,
      defaultOutput,
      id: this.id,
      comp: this.comp.name,
      folder: this.folder.name,
      fields: editableOverview,
    };
  }

  refresh() {
    this.editableFields = [];
    this.getEditableFields();
  }
}
