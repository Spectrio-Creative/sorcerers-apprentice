type FieldType = "Text" | "Media" | "Color" | "Group" | "Font" | "Audio";

interface InputFieldValue {
  fullTitle: string;
  title: string;
  type: FieldType;
  value: string;
  hidden?: boolean;
}

interface InputFieldEditables {
  value: string;
  hidden?: boolean;
}

type InputStatus = "Disabled" | "Ready" | "Processing" | "Complete";

interface InputTemplateValue {
  id: string;
  templateId: number;
  templateName: string;
  compName?: string;
  outputFile?: string;
  status?: InputStatus;
  fields: InputFieldValue[];
}
