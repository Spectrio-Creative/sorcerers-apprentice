import { searchLibrary } from "../../../tools/project";
import { FieldBase } from "../field/Field";
import { LayerMedia } from "./LayerMedia";

export class LayerAudio extends LayerMedia {
  constructor(layer: Layer, field: FieldBase, layerType?: LayerType) {
    super(layer, field, layerType);
  }

  setValue(value: string) {
    if (value === this.avLayer.source.name) return;

    // Check if value exists in the library
    const item = searchLibrary(value, { maxResult: 1, strict: true })[0] || searchLibrary(value, { maxResult: 1 })[0];

    if (item) {
      this.avLayer.replaceSource(item as AVItem, true);
      return;
    }
  }
}
