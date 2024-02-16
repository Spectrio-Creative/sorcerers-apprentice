import { FieldBase } from "../field/Field";
import { LayerBase } from "./LayerBase";

export class LayerFont extends LayerBase {
  textLayer: TextLayer;
  textDocument: TextDocument;
  textProperty: TextDocumentProperty;

  constructor(layer: Layer, field: FieldBase, layerType?: LayerType) {
    super(layer, field, layerType);

    this.textLayer = layer as TextLayer;
    this.textProperty = this.textLayer.sourceText;
    this.textDocument = this.textProperty.value as TextDocument;
  }

  setValue(value: string) {
    this.textDocument.font = value;
    this.textProperty.setValue(this.textDocument);
  }
}
