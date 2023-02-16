interface TextGroup extends TreeView {
  label: StaticText;
  visibilityToggle?: Checkbox;
  txt: EditText;
}

interface BrowseGroup extends TreeView {
  label: StaticText;
  txt: EditText;
  browse: Button;
}

interface ColorGroup extends TreeView {
  label: StaticText;
  txt: EditText;
  picker: Button;
}
