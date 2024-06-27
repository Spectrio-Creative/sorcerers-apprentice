import { importFile, searchLibrary } from "../../../tools/project";
import { LayerBaseOptions } from "./LayerBase";
import { LayerMedia } from "./LayerMedia";

export class LayerAudio extends LayerMedia {
  constructor(options: LayerBaseOptions) {
    super(options);
  }

  setValue(value: string) {
    if (value === this.avLayer.source.name) return;

    // Check if value exists in the library
    const item = searchLibrary(value, { maxResult: 1, strict: true })[0] || searchLibrary(value, { maxResult: 1 })[0] || importFile(value);

    if (item) {
      this.avLayer.replaceSource(item as AVItem, true);
      return;
    }
  }
}
