import extend from "just-extend";
import { createTemplateLayerBase } from "./TemplateLayerBase";

const createFontLayer = (layer, templateDetails) => {
  const base = createTemplateLayerBase(layer, templateDetails);

  return extend(base, {
    valueInText: function () {
      return this.property("Source Text") !== null ? this.property("Source Text").value.font : "";
    },
  });
};

export { createFontLayer };
