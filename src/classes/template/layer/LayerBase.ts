import { parseLayerType } from "../../../tools/layer";
import { FieldBase } from "../field/Field";

export class LayerBase {
  layer: Layer;
  layerType: LayerType;
  comp: CompItem;
  field: FieldBase;

  constructor(layer: Layer, field: FieldBase, layerType?: LayerType) {
    this.layer = layer;
    this.layerType = layerType || parseLayerType(this.layer);
    this.comp = layer.containingComp;
    this.field = field;
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  setValue(value: any, field: FieldBase) {
    // Placeholder
  }
}
