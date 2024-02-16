import { FieldBaseOptions } from "./Field";
import { FieldMedia } from "./FieldMedia";

export class FieldAudio extends FieldMedia {
  constructor(layer: Layer, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Audio";
  }
}
