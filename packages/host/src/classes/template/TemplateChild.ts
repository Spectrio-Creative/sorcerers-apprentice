import { allCompsFromFolder, forPropertyInGroup, searchComp } from "../../tools/project";
import { parseLayerName } from "../../tools/templates";
import { asRegEx } from "../../tools/regex";
import { Template } from "./Template";
import { FieldRef } from "./field/FieldRef";
import camelCase from "just-camel-case";
import { log } from "../../tools/system";

export interface MappedInputFieldValue extends InputFieldValue {
  fieldRef: FieldRef;
}

export class TemplateChild {
  name: string;
  id: number;
  folder: FolderItem;
  fieldRefs: FieldRef[] = [];
  parent: Template;
  mainComp: CompItem;
  allComps: CompItem[] = [];
  compVisiblity: GenericObject<{ layerId: number; enabled: boolean }[]> = {};
  idLookup: { [key: string]: number } = {};

  constructor(folder: FolderItem, parent: Template) {
    this.folder = folder;
    this.name = folder.name;
    this.id = folder.id;
    this.parent = parent;

    this.copyFolderContents();
    this.linkPrecomps();
    this.getEditableFields();
    this.linkExpressions();
    this.allComps = this.findChildComps();
  }

  setCompName(name: string) {
    this.mainComp.name = name;
  }

  setPrecompNames() {
    this.allComps.forEach((comp) => {
      if (comp.id === this.mainComp.id) return;
      comp.name = `${comp.name} [${this.name}]`;
    });
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
          this.mainComp = newComp;
        }
        this.idLookup[`${item.id}`] = newComp.id;
      } else {
        log(`Could not copy ${item.name} to folder ${output.name}.`);
      }
    }
  }

  findChildComps() {
    return allCompsFromFolder(this.folder);
  }

  linkPrecomps() {
    this.setCompName(this.name);
    this.allComps = this.findChildComps();
    // TODO: Insure that expressions are not broken
    this.allComps.forEach((comp) => {
      for (let i = 1; i <= comp.numLayers; i++) {
        const layer = comp.layer(i) as AVLayer;
        if (layer?.source && layer.source instanceof CompItem) {
          const source = layer.source as CompItem;
          const newSource = this.compFromParentId(source.id);
          if (!newSource) continue;
          layer.replaceSource(newSource, true);
        }
      }
    });

    this.setPrecompNames();
  }

  linkExpressions() {
    const preCompNames = this.allComps
      .filter((comp) => comp.id !== this.mainComp.id)
      .map((comp) => comp.name.replace(` [${this.name}]`, "_"));

    this.allComps.forEach((comp) => {
      for (let i = 1; i <= comp.numLayers; i++) {
        const layer = comp.layer(i) as AVLayer;
        if (!layer) continue;

        forPropertyInGroup(layer, (effect) => {
          if ((effect as Property)?.expressionEnabled) {
            const expression = (effect as Property).expression;
            const expressionCompMatches = expression.match(/comp\("(.*?)"\)|comp\('(.*?)'\)/g);
            if (!expressionCompMatches) return;

            const compNameRegEx = /comp\("(.*?)"\)|comp\('(.*?)'\)/;
            let newExpression = expression;
            for (const matchString of expressionCompMatches) {
              const match = matchString.match(compNameRegEx);
              const compName = match[1] || match[2];

              let newCompName = compName;
              if (compName === this.parent.comp.name) newCompName = this.name;
              else if (preCompNames.includes(compName)) newCompName = `${compName} [${this.name}]`;

              newExpression = newExpression.replace(matchString, `comp("${newCompName}")`);
            }

            (effect as Property).expression = newExpression;
          }
        });
      }
    });
  }

  compFromParentId(id: number) {
    const newId = this.idLookup[`${id}`];
    if (!newId) return null;
    return app.project.itemByID(newId) as CompItem;
  }

  getEditableFields() {
    this.parent.editableFields.forEach((field) => {
      const fieldLayer = field.layer;
      const fieldComp = fieldLayer.containingComp;
      const comp = this.compFromParentId(fieldComp.id);
      if (!comp) {
        log(`Could not find child comp for ${fieldLayer.name}`);
        return;
      }
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
    return input
      .map((inn) => {
        const title = inn.type === "Color" ? inn.title : inn.fullTitle || inn.title;
        const parsed = parseLayerName(title, true);

        const titleRegExp = asRegEx(parsed.title, { flags: "i" });

        const ref = (() => {
          let filtered = this.fieldRefs.filter((ref) => title === ref.field.title);
          if (filtered.length === 1) return filtered[0];

          filtered = this.fieldRefs.filter((ref) => titleRegExp.test(ref.field.title));
          if (filtered.length === 0) return null;
          if (filtered.length === 1) return filtered[0];
          filtered = filtered.filter((ref) => ref.field.tab === parsed.tab);
          if (filtered.length === 1) return filtered[0];
          filtered = filtered.filter((ref) => ref.field.tag === parsed.tag);
          if (filtered.length === 1) return filtered[0];
          filtered = filtered.filter((ref) => ref.field.type === parsed.type);
          if (filtered.length === 1) return filtered[0];
          if (filtered.length > 1) {
            alert(`Found multiple matches for ${title}.`);
            return null;
          }
          return null;
        })();

        if (!ref) {
          alert(`Could not find a layer reference for ${inn.title}`);
        }

        return { ...inn, fieldRef: ref } as MappedInputFieldValue;
      })
      .filter((val) => val.fieldRef);
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
        val.fieldRef.setLayerValue({ value, fontMap, hidden: val.hidden });
      } else {
        val.fieldRef.layer.layer.enabled = !val.hidden;
      }
    });

    this.fieldRefs.forEach((ref) => {
      ref.setFonts(fontMap);
    });
  }
}
