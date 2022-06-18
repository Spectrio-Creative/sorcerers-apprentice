import extend from "just-extend";
import { getLayerType } from "../../tools/getLayerType";
import { parseTemplateTitle } from "../../tools/library/sorcererDictionary";

const createTemplateLayerBase = (layer, templateDetails) => {
  const layerType = getLayerType(layer);
  templateDetails = templateDetails || parseTemplateTitle(layer.name);

  return extend(layer, {
    type: layerType,
    isEditable: !!templateDetails,
    templateDetails: templateDetails,
    // preservedLayer: layer,

    csvPlaceholder: function () {
      if (this.valueInText) return this.valueInText();
      return "";
    },
  });
};

export { createTemplateLayerBase };
