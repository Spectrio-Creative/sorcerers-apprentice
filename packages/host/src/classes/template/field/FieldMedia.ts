import { addMenuField } from "../../../pluginTools/dialogElements";
import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldMedia extends FieldBase {
  avLayer: AVLayer;
  menuField: ButtonGroup;
  simpleDisplay: boolean;

  constructor(layer: Layer, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Media";
    this.avLayer = layer as AVLayer;

    this.value = this.avLayer.source.name;
  }

  createMenuField(tab: Tab) {
    this.tabOptions.inputText = this.value;
    this.tabOptions.button = true;
    this.menuField = tab.add(addMenuField(this.title, this.tabOptions) as "treeview") as ButtonGroup;

    this.menuField.browse.onClick = this.browse;
    this.menuField.input.addEventListener("focus", this.focused);
    this.menuField.input.addEventListener("blur", this.unFocused);
    //   this.removeFieldListener();
    //   (obj.target as EditText).text = (obj.target as EditText).text.replace(/\*$/g, "");
    //   // this.addFieldListener();
    // });
    this.addFieldListener();
  }

  browse = () => {
    this.removeFieldListener();
    const file = File.openDialog("Choose a file") as File;
    if (!file) return;

    this.menuField.input.text = file.name + "*";
    this.value = file.absoluteURI;
    this.addFieldListener();
  };

  focused = (obj: UIEvent) => {
    const editText = obj.target as EditText;
    if (editText.text === this.value) return;
    this.simpleDisplay = true;

    editText.text = this.value;
  };

  unFocused = (obj: UIEvent) => {
    const editText = obj.target as EditText;
    if (!this.simpleDisplay) return;
    
    this.removeFieldListener();
    this.value = editText.text;
    editText.text = this.value.split(/\/|\\/).pop() as string + "*";

    this.addFieldListenerAfterChange();
    this.simpleDisplay = false;
  };
}
