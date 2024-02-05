import { searchComp } from "../../tools/ae";
import { Template } from "./Template";
import { FieldRef } from "./field/FieldRef";

export class TemplateChild {
  name: string;
  id: number;
  folder: FolderItem;
  fieldRefs: FieldRef[] = [];
  parent: Template;
  idLookup: { [key: string]: number } = {};

  constructor(folder: FolderItem, parent: Template) {
    this.folder = folder;
    this.name = folder.name;
    this.id = folder.id;
    this.parent = parent;

    this.copyFolderContents();
    this.linkPrecomps();
    this.getEditableFields();
  }

  copyFolderContents(input: FolderItem = this.parent.folder, output: FolderItem = this.folder) {
    for (let i = 1; i <= input.numItems; i++) {
      const item = input.item(i);
      if (item instanceof FolderItem) {
        const newFolder = output.items.addFolder(item.name);
        this.copyFolderContents(item, newFolder);
      } else if (item instanceof CompItem) {
        const newComp = item.duplicate();
        newComp.parentFolder = output;
        newComp.name = item.name;
        this.idLookup[`${item.id}`] = newComp.id;
      } else {
        alert(`Could not copy ${item.name} to folder ${output.name}.`);
      }
    }
  }

  allComps() {
    const results: CompItem[] = [];
    for (let i = 1; i < this.folder.numItems; i++) {
      const item = this.folder.item(i);
      if (item instanceof CompItem) {
        results.push(item);
      }
    }
    return results;
  }

  linkPrecomps() {
    // TODO: Insure that expressions are not broken
    const comps = this.allComps();
    comps.forEach((comp) => {
      for (let i = 1; i < comp.numLayers; i++) {
        const layer = comp.layer(i) as AVLayer;
        if (layer?.source && layer.source instanceof CompItem) {
          const source = layer.source as CompItem;
          const newSource = this.compFromParentId(source.id);
          layer.replaceSource(newSource, true);
        }
      }
    });
  }

  compFromParentId(id: number) {
    return app.project.itemByID(this.idLookup[`${id}`]) as CompItem;
  }

  getEditableFields() {
    this.parent.editableFields.forEach((field) => {
      const fieldLayer = field.layer;
      const fieldComp = fieldLayer.containingComp;
      const comp = this.compFromParentId(fieldComp.id);
      const layer = searchComp(fieldLayer.name, comp)[0];
      if (!layer) return;

      this.fieldRefs.push(new FieldRef(layer, field));
    });
  }

  fillValues() {
    alert(`Filling values for ${this.name}`);
    this.fieldRefs.forEach((ref) => {
      alert(`Setting value for ${ref.field.title}`);
      ref.setValueFromRef();
    });
  }
}
