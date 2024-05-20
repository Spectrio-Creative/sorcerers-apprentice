import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldGroup extends FieldBase {
  constructor(layer: Layer, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Group";
    this.value = "";
  }

  createMenuField(_tab: Tab) {
    // Do not create a menu field for groups
  }
}
