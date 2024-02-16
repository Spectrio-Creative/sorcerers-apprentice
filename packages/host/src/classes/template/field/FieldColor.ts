import { addMenuField } from "../../../pluginTools/dialogElements";
import { GoodBoyNinjaColorPicker, RGBA, decimalToRgb, rgbToHex } from "../../../tools/color";
import { FieldBase, FieldBaseOptions } from "./Field";

export class FieldColor extends FieldBase {
  menuField: ButtonGroup;
  effect: Property;
  color: Property;

  constructor(layer: Layer, effect: Property, options?: FieldBaseOptions) {
    super(layer, options);
    this.type = "Color";

    this.effect = effect;
    this.color = layer.effect(effect.name).property("Color") as Property;
    this.title = effect.name;
    this.value = `${this.color.value}`;
  }

  colorHex() {
    return "#" + rgbToHex(decimalToRgb(this.getRGBAValue()));
  }

  createMenuField(tab: Tab) {
    this.tabOptions.inputText = this.colorHex();
    this.tabOptions.buttonText = "Picker";
    this.tabOptions.button = true;

    this.menuField = tab.add(addMenuField(this.title, this.tabOptions) as "treeview") as ButtonGroup;

    this.menuField.browse.onClick = this.browse;
  }

  browse = () => {
    const result = GoodBoyNinjaColorPicker(this.getRGBAValue());

    this.value = `${result}`;
    this.menuField.input.text = this.colorHex();
  };

  getRGBAValue(): RGBA {
    const numbers = this.value
      .split(",")
      .map((v) => Number(v))
      .filter((v) => !isNaN(v));

    if (numbers.length === 3) numbers.push(1);
    while (numbers.length > 4) numbers.pop();

    return numbers as RGBA;
  }
}
