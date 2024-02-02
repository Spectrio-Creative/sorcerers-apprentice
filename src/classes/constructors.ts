import { parseLayerName } from "../tools/templates";
import { FieldBase } from "./template/field/Field";
import { FieldAudio } from "./template/field/FieldAudio";
import { FieldColor } from "./template/field/FieldColor";
import { FieldFont } from "./template/field/FieldFont";
import { FieldGroup } from "./template/field/FieldGroup";
import { FieldMedia } from "./template/field/FieldMedia";
import { FieldText } from "./template/field/FieldText";

export const makeFieldBase = (layer: Layer) => {
  const parsed = parseLayerName(layer.name);
  if (!parsed) return new FieldBase(layer);

  switch (parsed.type) {
    case "Text":
      return new FieldText(layer, parsed);
    case "Media":
      return new FieldMedia(layer, parsed);
    case "Color":
      return new FieldColor(layer, parsed);
    case "Group":
      return new FieldGroup(layer, parsed);
    case "Font":
      return new FieldFont(layer, parsed);
    case "Audio":
      return new FieldAudio(layer, parsed);
    default:
      return new FieldBase(layer, parsed);
  }
};
