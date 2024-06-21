interface FieldQuickOverview {
  fullTitle: string;
  title: string;
  type: FieldType | "Output" | "Format" | "Preset";
  tab?: string;
  tag?: string;
  options: FieldOption[];
  value: string;
  locked?: boolean;
  hidden?: boolean;
}

interface FieldOverview extends FieldQuickOverview {
  fullTitle: string;
  title: string;
  type: FieldType | "Output" | "Format" | "Preset";
  tab: string;
  tag: string;
  options: FieldOption[];
  value: string;
}

interface TemplateOverview {
  name: string;
  id: number;
  comp: string;
  folder: string;
  fields: FieldOverview[];
}

interface SorcererOverview {
  templates: TemplateOverview[];
  fonts: Font[];
  libraryAssets: MediaItem[];
}
