import { TabOptions } from "../../../pluginTools/dialogElements";
import { parseLayerName } from "../../../tools/templates";

export interface FieldBaseOptions {
  type: FieldType;
  options: FieldOption[];
  title: string;
  tag: string;
  tab: string;
}

export class FieldBase {
  layer: Layer;
  type: FieldType;
  options: FieldOption[] = [];
  title: string;
  tag: string;
  tab: string;
  menuField: FieldGroup;
  tabOptions: TabOptions = {
    tabbed: true,
    visible: true,
    visibilityToggle: false,
  } as TabOptions;
  value: string;

  constructor(layer: Layer, options?: FieldBaseOptions) {
    this.layer = layer;

    if (options) {
      this.type = options.type;
      this.options = options.options;
      this.title = options.title;
      this.tag = options.tag;
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

    const { type, options, tab, tag, title } = parsed;
    this.type = type;
    this.options = options;
    this.tag = tag;
    this.title = title;
    this.tab = tab;
  }

  getOverview() {
    return {
      fullTitle: this.layer.name,
      type: this.type,
      options: this.options,
      title: this.title,
      tag: this.tag,
      tab: this.tab,
      value: this.value,
    };
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  createMenuField(tab: Tab) {
    // this.menuField = tab.add(addMediaGroup(this.title, this.title, "tab") as "treeview");
    // addMediaGroup
  }

  onMenuChange = (event: UIEvent) => {
    const target = event.target as EditText | DropDownList;
    if (target instanceof DropDownList) {
      const selection = target.selection;
      if (selection instanceof ListItem) {
        this.value = selection.text;
        return;
      }

      const item = target.items[selection];
      this.value = item.text;
      return;
    }

    this.value = target.text;
  };

  addFieldListener() {
    this.menuField.input.addEventListener("change", this.onMenuChange);
  }

  addFieldListenerAfterChange() {
    const addListener = () => {
      this.menuField.input.addEventListener("change", this.onMenuChange);
    };

    this.menuField.input.addEventListener("change", addListener);
  }

  removeFieldListener() {
    while (this.menuField.input.removeEventListener("change", this.onMenuChange)) {
      // Remove all change listeners
    }
  }

  browse() {
    // Placeholder
  }

  getValue() {
    return this.value;
  }

  getSourceValue() {
    // Placeholder
  }

  setValue(value: string) {
    this.value = value;
    const input = this.menuField.input;
    if (input instanceof DropDownList) input.selection = input.find(value);
    else input.text = value;
  }

  setSourceValue(value: string): void {
    // Placeholder
  }
}
