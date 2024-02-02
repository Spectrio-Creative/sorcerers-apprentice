import { findLayers, getPreComps } from "../../tools/ae";
import { addTab, addTabbedPannel } from "../../uiGroupTemplates";
import { FieldBase } from "./field/Field";
import { makeFieldBase } from "../constructors";

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
    const comp = this.comp;

    //Get all layers that are tagged as editable
    const editableLayers = findLayers(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, comp) as Layer[];

    //Get all compositions from any subfolder containing the word 'Precomps'
    const preComps = getPreComps(compFolder);

    //Get all layers in preComps that are tagged as editable and push them to the main array
    for (let i = 0; i < preComps.length; i++) {
      const editables = findLayers(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, preComps[i]);
      for (let u = 0; u < editables.length; u++) {
        editableLayers.push(editables[u]);
      }
    }

    // allEditableLayers["t" + templateName.name + "_" + templateName.id] = editableLayers;

    editableLayers.forEach((layer) => {
      this.editableFields.push(makeFieldBase(layer));
    });
  }

  createMenuTab(mainTab: TabbedPanel) {
    this.menuTab = mainTab.add(addTab(this.name, this.name) as "tab") as Tab;
    this.menuPanel = this.menuTab.add(addTabbedPannel(this.name) as "tabbedpanel") as TabbedPanel;
  }

  addInnerTab(tabName: string) {
    const tab = this.menuPanel.add(addTab(tabName, tabName) as "tab") as Tab;
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
}
