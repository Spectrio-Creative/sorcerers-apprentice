interface FieldQuickOverview {
  title: string;
  type: FieldType;
  tab?: string;
  tag?: string;
  options?: FieldOption[];
  value: string;
  locked?: boolean;
}

interface FieldOverview extends FieldQuickOverview {
  title: string;
  type: FieldType;
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
