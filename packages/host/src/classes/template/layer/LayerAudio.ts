import { FieldBase } from "../field/Field";
import { LayerMedia } from "./LayerMedia";

export class LayerAudio extends LayerMedia {
  constructor(layer: Layer, field: FieldBase, layerType?: LayerType) {
    super(layer, field, layerType);
  }
}
