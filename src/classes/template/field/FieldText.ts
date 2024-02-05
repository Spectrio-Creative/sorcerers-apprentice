import { addTextGroup } from "../../../pluginTools/dialogElements";
import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldText extends FieldBase {
  textLayer: TextLayer;
  value: string;

  constructor(layer: Layer, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Text";
    this.textLayer = layer as TextLayer;

    this.value = this.getSourceValue();
  }

  createMenuField(tab: Tab) {
    const text = this.getSourceValue();
    this.tabOptions.inputText = text;
    this.menuField = tab.add(addTextGroup(this.title, this.tabOptions) as "treeview");
  }

  getValue() {
    return this.value;
  }

  getSourceValue() {
    return this.textLayer.sourceText.value.text;
  }

  setValue(value: string) {
    this.value = value;
  }

  setSourceValue(value: string): void {
    this.textLayer.sourceText.value.text = value;
  }
}
