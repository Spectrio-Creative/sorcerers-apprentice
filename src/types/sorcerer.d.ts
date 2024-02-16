type FieldType = "Text" | "Media" | "Color" | "Group" | "Font" | "Audio";

interface InputFieldValue {
  title: string;
  type?: FieldType;
  value: string;
}

interface InputTemplateValue {
  templateName: string;
  compName?: string;
  outputFile?: string;
  fields: InputFieldValue[];
}
