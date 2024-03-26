import { parseLayerType } from "../../../tools/layer";
import { FieldBase } from "../field/Field";
import { FieldColor } from "../field/FieldColor";
import { FieldRef } from "../field/FieldRef";
import { LayerAudio } from "./LayerAudio";
import { LayerBase } from "./LayerBase";
import { LayerColor } from "./LayerColor";
import { LayerFont } from "./LayerFont";
import { LayerMedia } from "./LayerMedia";
import { LayerText } from "./LayerText";

export const makeLayerBase = (layer: Layer, field: FieldBase, parent: FieldRef): LayerBase => {
  const layerType = parseLayerType(layer);

  // switch (layerType) {
  //   case "ADBE Text Layer":
  //     return new LayerText(layer);
  //   // TODO: Add other layer types here.
  //   default:
  //     return new LayerBase(layer);
  // }

  // const parsed = parseLayerName(layer.name);
  // if (!parsed) return [new FieldBase(layer)];

  switch (field.type) {
    case "Text":
      if (layerType !== "ADBE Text Layer") throw new Error(`Cannot make a text field from layer type ${layerType}.`);
      return new LayerText({ layer, field, layerType, parent });
    case "Media":
      return new LayerMedia({ layer, field, layerType, parent });
    case "Color":
      return new LayerColor({ layer, field: field as FieldColor, layerType, parent });
    case "Group":
      // return new LayerMedia(layer);
      break;
    case "Font":
      return new LayerFont({ layer, field, layerType, parent });
    case "Audio":
      return new LayerAudio({ layer, field, layerType, parent });
    default:
      return new LayerBase({ layer, field, layerType, parent });
  }
};
