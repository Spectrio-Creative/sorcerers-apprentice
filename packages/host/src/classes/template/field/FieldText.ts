import { addMenuField } from "../../../pluginTools/dialogElements";
import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldText extends FieldBase {
  textLayer: TextLayer;
  menuField: TextGroup;

  constructor(layer: Layer, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Text";
    this.textLayer = layer as TextLayer;

    this.value = this.getSourceValue();
  }

  createMenuField(tab: Tab) {
    const text = this.getSourceValue();
    this.tabOptions.inputText = text;
    this.menuField = tab.add(addMenuField(this.title, this.tabOptions) as "treeview") as TextGroup;
    this.addFieldListener();
  }

  getSourceValue() {
    return this.textLayer.sourceText.value.text;
  }

  setSourceValue(value: string): void {
    this.textLayer.sourceText.value.text = value;
  }
}
