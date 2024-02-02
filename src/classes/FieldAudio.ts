import { addMediaGroup } from "../dialogElements";
import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldAudio extends FieldBase {
  constructor(layer: Layer, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Audio";
  }

  createMenuField(tab: Tab) {
    this.menuField = tab.add(addMediaGroup(this.title, { tabbed: true, inputText: "" }) as "treeview");
    // addMediaGroup
  }
}
