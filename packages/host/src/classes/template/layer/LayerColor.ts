import { FieldColor } from "../field/FieldColor";
import { LayerBase, LayerBaseOptions } from "./LayerBase";

export class LayerColor extends LayerBase {
  constructor(options: LayerBaseOptions) {
    super(options);
  }

  setValue(value: RGB | RGBA) {
    const effectName = (this.field as FieldColor).effect.name;
    const effect = this.layer.effect(effectName);
    const color = effect.property("Color") as Property;

    (color as Property).setValue(value);
  }
}
