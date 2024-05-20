import { parseLayerType } from "../../../tools/layer";
import { FieldBase } from "../field/Field";
import { FieldRef } from "../field/FieldRef";

export interface LayerBaseOptions {
  layer: Layer;
  field: FieldBase;
  layerType?: LayerType;
  parent: FieldRef;
}

export class LayerBase {
  layer: Layer;
  layerType: LayerType;
  comp: CompItem;
  field: FieldBase;
  fieldRef: FieldRef;

  constructor({ layer, field, layerType, parent }: LayerBaseOptions) {
    this.fieldRef = parent;
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
