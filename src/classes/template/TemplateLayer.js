import { parseTemplateTitle } from "../../tools/library/sorcererDictionary";
import { createAudioLayer } from "./AudioLayer";
import { createFontLayer } from "./FontLayer";
import { createIVLayer } from "./IVLayer";
import { createTemplateLayerBase } from "./TemplateLayerBase";
import { createTextLayer } from "./TextLayer";

const createTemplateLayer = (layer, templateDetails) => {
  templateDetails = templateDetails || parseTemplateTitle(layer.name);
  if (!templateDetails) throw Error("Cannot Create Template Layer without template layer");

  switch (templateDetails.type) {
  case "Text":
    return createTextLayer(layer, templateDetails);
  case "Font":
    return createFontLayer(layer, templateDetails);
  case "Image":
  case "Video":
    return createIVLayer(layer, templateDetails);
  case "Audio":
    return createAudioLayer(layer, templateDetails);
  default:
    return createTemplateLayerBase(layer, templateDetails);
  }
};

export { createTemplateLayer };
