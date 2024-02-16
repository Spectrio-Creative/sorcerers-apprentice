import camelCase from "just-camel-case";
import { formatAsDecimal } from "../../../tools/color";
import { LayerBase } from "../layer/LayerBase";
import { LayerColor } from "../layer/LayerColor";
import { LayerFont } from "../layer/LayerFont";
import { LayerMedia } from "../layer/LayerMedia";
import { LayerText } from "../layer/LayerText";
import { makeLayerBase } from "../layer/makeLayerBase";
import { FieldBase } from "./Field";

export interface FieldRefValueOptions {
  fontMap?: GenericObject<string>;
  value?: string;
}

export class FieldRef {
  layer: LayerBase;
  field: FieldBase;

  constructor(layer: Layer, field: FieldBase) {
    this.layer = makeLayerBase(layer, field);
    this.field = field;
  }

  setLayerValue({fontMap, value}:FieldRefValueOptions = {}) {
    value = value ?? this.field.getValue();
    const type = this.field.type;
    if (type === "Group") {
      // Ignore groups
      return;
    }

    const layerType = this.layer.layerType;

    if (type === "Text" && layerType === "ADBE Text Layer") {
      const newFont = fontMap[camelCase(this.field.tag)];
      if (newFont) (this.layer as LayerText).setFont(newFont);

      (this.layer as LayerText).setValue(value);
      return;
    }

    if (type === "Media" && this.layer.layer.matchName === "ADBE AV Layer") {
      (this.layer as LayerMedia).setValue(value);
      return;
    }

    if (type === "Color") {
      const rbga = formatAsDecimal(value);
      (this.layer as LayerColor).setValue(rbga);
      return;
    }

    if (type === "Font") {
      // Placeholder
      (this.layer as LayerFont).setValue(value);
      return;
    }

    // alert(`Field: ${this.field.title}
    // Layer: ${this.layer.layer.name}`);

    // alert(`Setting value of ${this.field.title} to ${value}.`);
  }

  setFonts(fontMap: GenericObject<string>) {
    if (this.field.type === "Text") {
      const newFont = fontMap[camelCase(this.field.tag)];
      if (newFont) (this.layer as LayerText).setFont(newFont);
    }
  }
}
