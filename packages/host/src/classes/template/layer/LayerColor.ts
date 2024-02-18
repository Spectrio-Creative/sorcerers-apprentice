import { FieldColor } from "../field/FieldColor";
import { LayerBase } from "./LayerBase";

export class LayerColor extends LayerBase {
  constructor(layer: Layer, field: FieldColor, layerType?: LayerType) {
    super(layer, field, layerType);
  }

  setValue(value: RGB | RGBA) {
    const effectName = (this.field as FieldColor).effect.name;
    const effect = this.layer.effect(effectName);
    const color = effect.property("Color") as Property;

    (color as Property).setValue(value);
  }
}
