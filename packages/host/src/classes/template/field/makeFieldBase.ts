import { parseLayerName } from "../../../../../shared/tools/templates";
import { parseColorLayer } from "../../../tools/templates";
import { FieldBase } from "./Field";
import { FieldAudio } from "./FieldAudio";
import { FieldColor } from "./FieldColor";
import { FieldFont } from "./FieldFont";
import { FieldGroup } from "./FieldGroup";
import { FieldMedia } from "./FieldMedia";
import { FieldText } from "./FieldText";

export const makeFieldBase = (layer: Layer): FieldBase[] => {
  const parsed = parseLayerName(layer.name);
  if (!parsed) return [new FieldBase(layer)];

  switch (parsed.type) {
    case "Text":
      return [new FieldText(layer, parsed)];
    case "Media":
      return [new FieldMedia(layer, parsed)];
    case "Color":
      return parseColorLayer(layer).map((effect) => new FieldColor(layer, effect, parsed));
    case "Group":
      return [new FieldGroup(layer, parsed)];
    case "Font":
      return [new FieldFont(layer, parsed)];
    case "Audio":
      return [new FieldAudio(layer, parsed)];
    default:
      return [new FieldBase(layer, parsed)];
  }
};
