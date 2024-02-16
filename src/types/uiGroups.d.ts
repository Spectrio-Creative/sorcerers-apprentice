interface FieldGroup extends TreeView {
  name: string;
  ss_type: string;
  orientation: _Orientation;
  spacing: number;
  margins: _Margins;
  alignChildren: _AlignmentProperty;
  visibilityToggle?: Checkbox;
  label: StaticText;
  input: EditText | DropDownList;
  browse?: Button;
}

interface TextGroup extends FieldGroup {
  input: EditText;
}

interface ButtonGroup extends TextGroup {
  browse: Button;
}

interface DropdownGroup extends FieldGroup {
  input: DropDownList;
}

interface ColorGroup extends TreeView {
  name: string;
  ss_type: string;
  orientation: _Orientation;
  spacing: number;
  margins: _Margins;
  alignChildren: _AlignmentProperty;
  label: StaticText;
  txt: EditText;
  picker: Button;
}
