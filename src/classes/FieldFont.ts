import { addTextGroup } from "../dialogElements";
import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldFont extends FieldBase {
  constructor(layer: Layer, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Font";
  }

  createMenuField(tab: Tab) {
    // This can maybe be replaced with a dropdown at some point
    this.menuField = tab.add(addTextGroup(this.title, { tabbed: true }) as "treeview");
  }
}
