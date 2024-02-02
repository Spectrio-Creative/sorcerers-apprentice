import { addColorGroup } from "../../../dialogElements";
import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldColor extends FieldBase {
  constructor(layer: Layer, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Color";
  }

  createMenuField(tab: Tab) {
    this.menuField = tab.add(addColorGroup(this.title, { tabbed: true }) as "treeview");
    // addMediaGroup
  }
}
