import { searchLibrary } from "../../../tools/project";
import { FieldBase } from "../field/Field";
import { LayerBase } from "./LayerBase";

export class LayerMedia extends LayerBase {
  avLayer: AVLayer;

  constructor(layer: Layer, field: FieldBase, layerType?: LayerType) {
    super(layer, field, layerType);
    this.avLayer = layer as AVLayer;
  }

  setValue(value: string) {
    if (value === this.avLayer.source.name) return;

    // Check if value exists in the library
    const item = searchLibrary(value, { maxResult: 1, strict: true })[0] || searchLibrary(value, { maxResult: 1 })[0];

    if (item) {
      this.avLayer.replaceSource(item as AVItem, true);
      return;
    }

    alert(`Setting value of ${this.field.title} to ${value}.`);
  }
}
