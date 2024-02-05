import { TabOptions } from "../../../pluginTools/dialogElements";
import { parseLayerName } from "../../../tools/templates";

export type FieldType = "Text" | "Media" | "Color" | "Group" | "Font" | "Audio";

export type FieldOption = "visible" | "background-size" | "fill-size" | "no-scale" | "scale-down" | "linked-subtag";

export interface FieldBaseOptions {
  type: FieldType;
  options: FieldOption[];
  title: string;
  group: string;
  tab: string;
}

export class FieldBase {
  layer: Layer;
  type: FieldType;
  options: FieldOption[] = [];
  title: string;
  group: string;
  tab: string;
  menuField: TreeView;
  tabOptions: TabOptions = {
    tabbed: true,
    visible: true,
    visibilityToggle: false,
  } as TabOptions;

  constructor(layer: Layer, options?: FieldBaseOptions) {
    this.layer = layer;

    if (options) {
      this.type = options.type;
      this.options = options.options;
      this.title = options.title;
      this.group = options.group;
      this.tab = options.tab;
    } else this.parseLayerName();

    this.tabOptions = {
      tabbed: true,
      visibilityToggle: this.options.includes("visible"),
      visible: layer.enabled,
    };
  }

  parseLayerName() {
    const parsed = parseLayerName(this.layer.name);
    if (!parsed) return;

    const { type, options, tab, group, title } = parsed;
    this.type = type;
    this.options = options;
    this.group = group;
    this.title = title;
    this.tab = tab;
  }

  getOverview() {
    return {
      type: this.type,
      options: this.options,
      title: this.title,
      group: this.group,
      tab: this.tab,
    };
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  createMenuField(tab: Tab) {
    // this.menuField = tab.add(addMediaGroup(this.title, this.title, "tab") as "treeview");
    // addMediaGroup
  }

  browse() {
    // Placeholder
  }

  getValue() {
    // Placeholder
  }

  getSourceValue() {
    // Placeholder
  }

  setValue(value: string) {
    // Placeholder
  }

  setSourceValue(value: string) {
    // Placeholder
  }
}
