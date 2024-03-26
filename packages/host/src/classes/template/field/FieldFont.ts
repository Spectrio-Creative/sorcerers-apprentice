import { fontLibrary } from "../../../globals/project/fontLibrary";
import { addMenuField } from "../../../pluginTools/dialogElements";
import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldFont extends FieldBase {
  textLayer: TextLayer;
  textDocument: TextDocument;
  textProperty: TextDocumentProperty;
  menuField: DropdownGroup;

  constructor(layer: Layer, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Font";
    this.textLayer = layer as TextLayer;

    this.textProperty = this.textLayer.sourceText;
    this.textDocument = this.textProperty.value as TextDocument;

    this.value = this.getSourceFont();
  }

  createMenuField(tab: Tab) {
    this.tabOptions.inputText = this.value;
    this.tabOptions.options = fontLibrary.fontOptions();
    this.menuField = tab.add(addMenuField(this.title, this.tabOptions) as "treeview") as DropdownGroup;
    for (let i = 0; i < this.tabOptions.options.length; i++) {
      const option = this.tabOptions.options[i];
      this.menuField.input.add("item", option);
    }

    let valueIndex;
    for (let i = 0; i < this.menuField.input.items.length; i++) {
      const item = this.menuField.input.items[i];
      if (item.text === this.value) {
        valueIndex = i;
        break;
      }
    }

    this.menuField.input.selection = valueIndex;

    this.addFieldListener();
  }

  // createMenuField(tab: Tab) {
  //   // This can maybe be replaced with a dropdown at some point
  //   this.menuField = tab.add(addTextGroup(this.title, { tabbed: true }) as "treeview") as TextGroup;
  // }

  getSourceFont() {
    return this.textDocument.font;
  }

  setSourceFont(value: string): void {
    this.textDocument.font = value;
    this.textProperty.setValue(this.textDocument);
  }
}
