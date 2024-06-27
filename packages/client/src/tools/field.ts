import { parseLayerName } from "../../../shared/tools/templates";
import { ameStore } from "../stores/ame";

export interface FieldSuperQuickOverview {
  fullTitle?: string;
  title: string;
  type?: FieldType | "Output" | "Format" | "Preset";
  tab?: string;
  tag?: string;
  options?: FieldOption[];
  value?: string;
  locked?: boolean;
  hidden?: boolean;
}

export const createFieldOverview = (partial: FieldSuperQuickOverview, editable?: boolean) => {
  const { fullTitle, title, type, tab, tag, options, value, locked, hidden } = partial;
  return {
    fullTitle: fullTitle || title,
    title,
    value: value || "",
    type: type || "Text",
    options: options || [],
    tab: tab || "",
    tag: tag || "",
    locked: editable === false || locked || false,
    hidden: hidden || false,
  } as FieldQuickOverview;
};

export const getFieldFromTemplate = (template: TemplateOverview, header: string, value?: string) => {
  const ame = ameStore();
  if (header === "Template Name") return createFieldOverview({ title: "Template Name", value: template.name }, false);
  if (header === "Comp Name") return createFieldOverview({ title: "Comp Name", value: template.name });
  if (header === "Output File")
    return createFieldOverview({ title: "Output File", value: template.defaultOutput || "", type: "Output" });
  if (header === "Output Format") return createFieldOverview({ title: "Output Format", value: ame.defaultFormat, type: "Format" });
  const defaultPreset = ame.getPresets(ame.defaultFormat)[0] || "";
  if (header === "Output Preset") return createFieldOverview({ title: "Output Preset", value: defaultPreset, type: "Preset" });

  const headerParts = Object.entries(parseLayerName(header, true) || {}).filter(([_key, value]) =>
    Array.isArray(value) ? value.length : !!value
  );

  const exactField = template.fields.find((field) => {
    const fieldParts = parseLayerName(field.fullTitle, true) as Record<string, string | FieldOption[]>;
    fieldParts.title = field.title;
    if (!fieldParts) return false;

    return headerParts.every(([key, value]) => {
      if (Array.isArray(value)) {
        const fieldArray = fieldParts[key] as FieldOption[];
        return fieldArray && value.every((val) => fieldArray.includes(val));
      }
      return fieldParts[key] === value;
    });
  });

  if (exactField) {
    const field = { ...exactField, options: [...exactField.options] } as FieldQuickOverview;
    
    if (field.options.includes("visible") && value) {
      // Get checkbox value and remove it from the value
      const checkBox = (value.match(/\[(x?)\]/) || [])[1];
      field.hidden = checkBox === "";
      value = value.replace(/\[(x?)\] /, "");
    }

    if (value) {
      field.value = value;
    }
    return field;
  }

  return (
    (template.fields.find((field) => field.title === header) as FieldOverview) ||
    ({ title: header, value: "", type: "Group" } as FieldQuickOverview)
  );
};
