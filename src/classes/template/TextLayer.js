import extend from "just-extend";
import { createTemplateLayerBase } from "./TemplateLayerBase";

const createTextLayer = (layer, templateDetails) => {
  const base = createTemplateLayerBase(layer, templateDetails);

  return extend(base, {
    valueInText: function () {
      return this.property("Source Text").value.text;
    },
  });
};

export { createTextLayer };
