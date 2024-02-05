import { addTextGroup } from "../../../pluginTools/dialogElements";
import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldMedia extends FieldBase {
  avLayer: AVLayer;
  menuField: ButtonGroup;

  constructor(layer: Layer, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Media";
    this.avLayer = layer as AVLayer;
  }

  createMenuField(tab: Tab) {
    const text = this.avLayer.source.name;
    this.tabOptions.inputText = text;
    this.tabOptions.button = true;
    this.menuField = tab.add(addTextGroup(this.title, this.tabOptions) as "treeview") as unknown as ButtonGroup;

    this.menuField.browse.onClick = this.browse;
  }

  browse = () => {
    const file = File.openDialog("Choose a file") as File;
    if (!file) return;

    alert(file.name);

    // this.avLayer.replaceSource(file);
    // this.menuField.inputText.text = file.name;
  };
}
