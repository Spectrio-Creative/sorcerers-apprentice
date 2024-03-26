type FieldType = "Text" | "Media" | "Color" | "Group" | "Font" | "Audio";

interface InputFieldValue {
  fullTitle: string;
  title: string;
  tab?: string;
  options: FieldOption[];
  type: FieldType | "Output";
  value: string;
  hidden?: boolean;
}

interface InputFieldEditables {
  value: string;
  hidden?: boolean;
}

type InputStatus = "Disabled" | "Ready" | "Processing" | "Complete";

interface TemplateOverviewField {
  fullTitle: string,
  title: string,
  headerTitle: string,
  defaultValue: string
}


interface InputTemplateValue {
  id: string;
  templateId: number;
  templateName: string;
  templateOverview: TemplateOverviewField[];
  compName?: string;
  outputFile?: string;
  status?: InputStatus;
  fields: InputFieldValue[];
}
