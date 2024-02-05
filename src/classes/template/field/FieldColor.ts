import { addTextGroup } from "../../../pluginTools/dialogElements";
import { GoodBoyNinjaColorPicker, RGBA, decimalToRgb, rgbToHex } from "../../../tools/color";
import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldColor extends FieldBase {
  menuField: TextGroup;
  effect: Property;
  color: Property;
  value: RGBA;

  constructor(layer: Layer, effect: Property, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Color";

    this.effect = effect;
    this.color = layer.effect(effect.name).property("Color") as Property;
    this.title = effect.name;
    this.value = this.color.value;
  }

  colorHex() {
    return "#" + rgbToHex(decimalToRgb(this.value));
  }

  createMenuField(tab: Tab) {
    this.tabOptions.inputText = this.colorHex();
    this.tabOptions.buttonText = "Picker";
    this.tabOptions.button = true;

    this.menuField = tab.add(addTextGroup(this.title, this.tabOptions) as "treeview") as ButtonGroup;

    this.menuField.browse.onClick = this.browse;
  }

  browse = () => {
    const result = GoodBoyNinjaColorPicker(this.color.value);

    this.value = result;
    this.menuField.text.text = this.colorHex();
  };
}
