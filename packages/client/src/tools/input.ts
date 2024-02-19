import { nanoid } from "nanoid";

export const createInputFromTemplate = (template: TemplateOverview): InputTemplateValue => {
  console.log("Creating input from template", template.name);
  const input: InputTemplateValue = {
    id: nanoid(),
    templateId: template.id,
    templateName: template.name,
    compName: template.comp,
    status: "Ready",
    fields: [],
  };

  return input;
};
