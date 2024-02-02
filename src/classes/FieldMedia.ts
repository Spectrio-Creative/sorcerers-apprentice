import { addMediaGroup } from "../dialogElements";
import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldMedia extends FieldBase {
  constructor(layer: Layer, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Media";
  }

  createMenuField(tab: Tab) {
    this.menuField = tab.add(addMediaGroup(this.title, { tabbed: true, inputText: "" }) as "treeview");
    // addMediaGroup
  }
}
