import extend from "just-extend";
import { createTemplateLayerBase } from "./TemplateLayerBase";

const createIVLayer = (layer, templateDetails) => {
  const base = createTemplateLayerBase(layer, templateDetails);

  return extend(base, {
    valueInText: function () {
      // ToDo: Real Lookup
      return "~/";
    },
  });
};

export { createIVLayer };
