import { addTextGroup } from "../../../dialogElements";
import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldText extends FieldBase {
  textLayer: TextLayer;

  constructor(layer: Layer, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Text";
    this.textLayer = layer as TextLayer;
  }

  createMenuField(tab: Tab) {
    const text = this.textLayer.text.sourceText.value.text;
    this.menuField = tab.add(addTextGroup(this.title, { tabbed: true, inputText: text }) as "treeview");
    // addMediaGroup
  }
}
