import extend from "just-extend";
import { getLayerType } from "../tools/getLayerType";
import { parseTemplateTitle } from "../tools/library/sorcererDictionary";
import { createTemplateLayer } from "./template/TemplateLayer";

const createLayer = (layer) => {
  const layerType = getLayerType(layer);
  const templateDetails = parseTemplateTitle(layer.name);

  return templateDetails
    ? createTemplateLayer(layer, templateDetails)
    : extend(layer, {
      type: layerType,
      isEditable: !!templateDetails,
    });
};

export { createLayer };
