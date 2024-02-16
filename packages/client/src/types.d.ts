interface Template {
  name: string;
  id: number;
  comp: string;
  folder: string;
  fields: TemplateField[];
}

interface TemplateField {
    type: TemplateFieldType;
    options: string[];
    title: string;
    group: string;
    tab: string;
}

type TemplateFieldType = "Text" | "Media" | "Color" | "Group" | "Font";

type TemplateOptions = "visible" | "background-size";