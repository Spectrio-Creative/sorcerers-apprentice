import { LayerBase, LayerBaseOptions } from "./LayerBase";

export class LayerFont extends LayerBase {
  textLayer: TextLayer;
  textDocument: TextDocument;
  textProperty: TextDocumentProperty;

  constructor(options: LayerBaseOptions) {
    super(options);

    this.textLayer = options.layer as TextLayer;
    this.textProperty = this.textLayer.sourceText;
    this.textDocument = this.textProperty.value as TextDocument;
  }

  setValue(value: string) {
    this.textDocument.font = value;
    this.textProperty.setValue(this.textDocument);
  }
}
