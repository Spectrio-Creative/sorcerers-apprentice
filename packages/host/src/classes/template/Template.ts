import { addTab, addTabbedPannel } from "../../pluginTools/dialogElements";
import { searchComp, searchLibrary } from "../../tools/project";
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
    // const compFolder = this.folder;
    const comp = this.comp;

    //Get all layers that are tagged as editable
    const editableLayers = searchComp(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, comp, { recursive: true }) as Layer[];

    editableLayers.forEach((layer) => {
      this.editableFields.push(...makeFieldBase(layer));
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

  duplicate(name: string, fillValues = false) {
    const result = searchLibrary(/^User Comps/g, { type: "Folder", recursive: false }) as FolderItem[];
    const userComps = result[0] || app.project.items.addFolder("User Comps");

    const newFolder = userComps.items.addFolder(name);
    const templateChild = new TemplateChild(newFolder, this);
    this.children.push(templateChild);

    if (fillValues) templateChild.fillValues();

    return templateChild;
  }

  getOverview() {
    const editableOverview = this.editableFields.map((field) => field.getOverview());
    return {
      name: this.name,
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
