// UI Group Templates to use in the UI Set up
// ============

export interface TabOptions {
  tabbed?: boolean;
  inputText?: string;
  visible?: boolean;
  visibilityToggle?: boolean;
  multiline?: boolean;
  button?: boolean;
  buttonText?: string;
  options?: string[];
}

export function addMenuField(label: string, options?: TabOptions) {
  const inText = options?.inputText || "";

  let labelWidth = 91;
  let textWidth = 378;
  let buttonWidth = 0;

  if (options?.tabbed) {
    labelWidth = 110;
    textWidth = 302;
  }
  
  if (options?.button) {
    labelWidth = 91;
    textWidth = 278;
    buttonWidth = 90;
  }
  
  if (options?.tabbed && options?.button) {
    labelWidth = 110;
    textWidth = 202;
  }

  const multiline = options?.multiline ? true : false;
  const textHeight = multiline ? 60 : 25;
  const visible = typeof options?.visible === "boolean" ? options.visible : true;
  const visibilityToggle = typeof options?.visibilityToggle === "boolean" ? options.visibilityToggle : false;

  let toggle = "";

  if (visibilityToggle) {
    labelWidth = labelWidth - 27;
    toggle = `visibilityToggle: Checkbox {
    text:'',
    alignment: ['left','bottom'],
    preferredSize: [-1, 19],
    value: ${visible}
  }, \n`;
  }
  
  let button = "";

  if (options?.button) {
    button = `browse: Button { 
      text: '${options.buttonText || "Browse"}', 
      preferredSize:[${buttonWidth},25]
    }`;
  }

  let input = `input: EditText {
    name:'txt',
    ss_type: 'Text',
    text: '${inText}',
    preferredSize:[${textWidth},${textHeight}],
    alignment: ['left','fill'],
    properties: {
      multiline: ${multiline}
    }
  }`;

  if (options?.options) {
    input = `input: DropDownList {
      name:'txt',
      ss_type: 'Dropdown',
      preferredSize:[${textWidth},25],
      alignment: ['left','fill'],
    }`;
  }

  return `group {
        name: 'Text: ${label}',
        ss_type: 'Text Group',
        orientation:'row',
        alignment:['fill','top'],
        alignChildren: ['left','center'],
        spacing: 10,
        margins: 0,
        ${toggle}
        label: StaticText { 
          text:'${label}', 
          preferredSize: [${labelWidth}, -1]
        }, 
        ${input},
        ${button}
    }`;
}

export interface ITab extends Tab {
  text: string;
  name: string;
  ss_type: string;
  orientation: _Orientation;
  spacing: number;
  margins: _Margins;
  alignChildren: _AlignmentProperty;
}

export interface InnerTab extends Tab {
  name: string;
  ss_type: string;
  alignChildren: _AlignmentProperty;
  preferredSize: Dimension;
  margins: _Margins;
  alignment: _AlignmentProperty;
}

export function addTab(label: string) {
  return `tab {
        text: '${label}', 
        name: '${label}', 
        ss_type: 'Tab', 
        orientation: 'column', 
        spacing: 10,
        margins: 10, 
        alignChildren: 'left',
    }`;
}

export interface OuterTabbedPanel extends TabbedPanel {
  name: string;
  ss_type: string;
  alignChildren: _AlignmentProperty;
  preferredSize: Dimension;
  margins: Margins;
  alignment: _AlignmentProperty;
  children: InnerTab[];
}

export function addTabbedPannel(tabName: string) {
  return `tabbedpanel {
        name: '${tabName}', 
        ss_type: 'Tabbed Pannel', 
        alignChildren: 'fill', 
        preferredSize: [455, -1],
        margins: 0, 
        alignment: ['fill','top'],
    }`;
}
