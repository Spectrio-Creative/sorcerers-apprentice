interface TextGroup extends TreeView {
  label: StaticText;
  visibilityToggle?: Checkbox;
  txt: EditText;
}

interface TextGroup extends TreeView {
  name: string;
  ss_type: string;
  orientation: _Orientation;
  spacing: number;
  margins: _Margins;
  alignChildren: _AlignmentProperty;
  visibilityToggle?: Checkbox;
  label: StaticText;
  text: EditText;
  browse?: Button;
}

interface ButtonGroup extends TextGroup {
  browse: Button;
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
