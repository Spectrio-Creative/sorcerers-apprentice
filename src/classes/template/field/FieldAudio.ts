import { addTextGroup } from "../../../pluginTools/dialogElements";
import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldAudio extends FieldBase {
  avLayer: AVLayer;

  constructor(layer: Layer, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Audio";
    
    this.avLayer = layer as AVLayer;
  }

  createMenuField(tab: Tab) {
    const text = this.avLayer.source.name;
    this.tabOptions.inputText = text;
    this.tabOptions.button = true;
    this.menuField = tab.add(addTextGroup(this.title, this.tabOptions) as "treeview") as unknown as ButtonGroup;
    // addMediaGroup
  }
}
