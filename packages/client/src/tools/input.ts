import { nanoid } from "nanoid";

export const createInputFromTemplate = (template: TemplateOverview): InputTemplateValue => {
  const templateOverview = template.fields
    .filter((field) => field.type !== "Group")
    .map((field) => {
      let defaultValue = field.value;
      if (field.options.includes("visible")) {
        const checkBox = field.hidden ? "[]" : "[x]";
        defaultValue = `${checkBox} ${defaultValue}`;
      }

      return {
        fullTitle: field.fullTitle,
        title: field.title,
        headerTitle: field.tab ? `[${field.tab}] ${field.title}` : field.title,
        defaultValue,
      };
    });

  const input: InputTemplateValue = {
    id: nanoid(),
    templateId: template.id,
    templateName: template.name,
    compName: template.comp,
    outputFile: `~/${template.name}.mp4`,
    templateOverview,
    status: "Ready",
    fields: [],
  };

  return input;
};

export const getTemplateRow = (row: { [key: string]: string }, search: RegExp) => {
  for (const key in row) {
    if (!search.test(key)) continue;

    return {
      name: row[key],
      key: key,
    };  
  }

  return {
    name: undefined,
    key: undefined,
  };
};