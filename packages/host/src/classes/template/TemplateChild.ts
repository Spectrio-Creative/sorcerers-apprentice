import { searchComp } from "../../tools/project";
import { parseLayerName } from "../../tools/templates";
import { Template } from "./Template";
import { FieldRef } from "./field/FieldRef";
import camelCase from "just-camel-case";

export interface MappedInputFieldValue extends InputFieldValue {
  fieldRef: FieldRef;
}

export class TemplateChild {
  name: string;
  id: number;
  folder: FolderItem;
  fieldRefs: FieldRef[] = [];
  parent: Template;
  comp: CompItem;
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

  setCompName(name: string) {
    this.comp.name = name;
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
        if (item.id === this.parent.comp.id) {
          this.comp = newComp;
        }
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
      const layer = searchComp(fieldLayer.name, comp, { strict: true })[0];
      if (!layer) return;

      this.fieldRefs.push(new FieldRef(layer, field));
    });
  }

  fillValues(input?: InputFieldValue[]) {
    if (input) {
      this.fillValuesFromInput(input);
    } else {
      this.fillValuesFromRef();
    }
  }

  fillValuesFromRef() {
    const fontFields = this.fieldRefs.filter((ref) => ref.field.type === "Font");
    const fontMap: GenericObject<string> = {};

    fontFields.forEach((ref) => {
      const value = ref.field.getValue();
      fontMap[camelCase(ref.field.title)] = value;
    });

    this.fieldRefs.forEach((ref) => {
      try {
        ref.setLayerValue({ fontMap });
      } catch (error) {
        alert(`Error setting value for ${ref.field.title}.
        ${error}`);
      }
    });
  }

  mapFieldsToInput(input: InputFieldValue[]): MappedInputFieldValue[] {
    // TODO: This function could be more efficient
    return input.map((inn) => {
      const parsed = parseLayerName(inn.fullTitle || inn.title, true);

      const ref = (() => {
        let filtered = this.fieldRefs.filter((ref) => new RegExp(parsed.title, "i").test(ref.field.title));
        if (filtered.length === 0) return null;
        if (filtered.length === 1) return filtered[0];
        filtered = filtered.filter((ref) => ref.field.tab === parsed.tab);
        if (filtered.length === 1) return filtered[0];
        filtered = filtered.filter((ref) => ref.field.tag === parsed.tag);
        if (filtered.length === 1) return filtered[0];
        filtered = filtered.filter((ref) => ref.field.type === parsed.type);
        if (filtered.length === 1) return filtered[0];
        return null;
      })();

      if (!ref) {
        alert(`Could not find a layer reference for ${inn.title}`);
      }

      return { ...inn, fieldRef: ref } as MappedInputFieldValue;
    }).filter((val) => val.fieldRef);
  }

  fillValuesFromInput(input: InputFieldValue[]) {
    const fields = this.mapFieldsToInput(input);

    const fontFields = fields.filter((val) => val.fieldRef.field.type === "Font");
    const fontMap: GenericObject<string> = {};

    fontFields.forEach((val) => {
      const value = val.value;
      fontMap[camelCase(val.fieldRef.field.title)] = value;
    });
    
    fields.forEach((val) => {
      const value = val.value;
      if (value) {
        val.fieldRef.setLayerValue({ value, fontMap });
      }
    });

    this.fieldRefs.forEach((ref) => {
      ref.setFonts(fontMap);
    });
  }
}
