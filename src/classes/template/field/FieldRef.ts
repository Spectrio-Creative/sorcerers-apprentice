import { FieldBase } from "./Field";

export class FieldRef {
  layer: Layer;
  field: FieldBase;

  constructor(layer: Layer, field: FieldBase) {
    this.layer = layer;
    this.field = field;
  }

  setValueFromRef() {
    const value = this.field.getValue();
    alert(`Setting value of ${this.field.title} to ${value}.`);
  }
}
