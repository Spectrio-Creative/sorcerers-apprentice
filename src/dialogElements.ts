// UI Group Templates to use in the UI Set up
// ============

export interface TextGroupOptions {
  tabbed?: boolean;
  inputText?: string;
  visibilityToggle?: boolean;
  visible?: boolean;
  multiline?: boolean;
}

export function addTextGroup(label: string, options?: TextGroupOptions) {
  const inText = options?.inputText || "";

  let sizes = options?.tabbed ? [110, 302] : [91, 378];
  const multiline = options?.multiline ? true : false;
  const h = multiline ? 60 : 25;
  const visible = typeof options?.visible === "boolean" ? options.visible : true;
  const visibilityToggle = options?.visibilityToggle ? `visibilityToggle: Checkbox {
    text:'',
    alignment: ['left','bottom'],
    preferredSize: [-1, 19],
    value: ${visible}
  }, \n` : "";

  sizes = !visible ? sizes : [82, sizes[1]];
  return `group {
        name: 'Text: ${label}',
        ss_type: 'Text Group',
        orientation:'row',
        alignment:['fill','top'],
        alignChildren: ['left','center'],
        spacing: 10,
        margins: 0,
        ${visibilityToggle}
        label: StaticText { 
          text:'${label}', 
          preferredSize: [${sizes[0]}, -1]
        }, 
        txt: EditText { 
          name:'txt',
          ss_type: 'Text',
          text: '${inText[0]}', 
          preferredSize:[${sizes[1]},${h}], 
          alignment: ['left','fill'], 
          properties: {
            multiline: ${multiline}
          }
        }
    }`;
}

export interface MediaGroupOptions {
  tabbed?: boolean;
  inputText?: string;
  visibilityToggle?: boolean;
  visible?: boolean;
}

export function addMediaGroup(label: string, options?: MediaGroupOptions) {
  const inText = options?.inputText || "";

  let sizes = options?.tabbed ? [110, 202, 90] : [91, 278, 90];
  const visible = typeof options?.visible === "boolean" ? options.visible : true;
  const visibilityToggle = options?.visibilityToggle ? `visibilityToggle: Checkbox {
    text:'',
    alignment: ['left','center'],
    preferredSize: [-1, 15],
    value: ${visible}
  } \n` : "";

  sizes = !visible ? sizes : [82, sizes[1]];

  return `group { 
        name: 'Media: ${label}', 
        ss_type: 'Media Group',
        orientation:'row',
        alignment:['fill','top'],
        alignChildren: ['left','center'],
        spacing: 10,
        margins: 0,
        ${visibilityToggle}
        label: StaticText { 
          text:'${label}',
          preferredSize: [${sizes[0]}, -1]
        }, 
        media: EditText { 
          name:'media', 
          ss_type: 'Media', 
          text: '${inText[0]}', 
          preferredSize:[${sizes[1]},25], 
          alignment: ['left','fill']
        }
        browse: Button { 
          text: 'Browse', 
          preferredSize:[${sizes[2]},25]
        }
    }`;
}

export interface ColorGroupOptions {
  tabbed?: boolean;
  inputText?: string;
}

export function addColorGroup(label: string, options?: ColorGroupOptions) {
  const inText = options?.inputText || "";

  const sizes = options?.tabbed ? [110, 202, 90] : [91, 278, 90];
  return `group { 
        name: 'Color: ${label}',
        ss_type: 'Color Group',
        orientation:'row',
        alignment:['fill','top'],
        alignChildren: ['left','center'],
        spacing: 10,
        margins: 0,
        label: StaticText { 
          text:'${label}', 
          preferredSize: [${sizes[0]}, -1]
        }, 
        txt: EditText { 
          name:'txt', 
          ss_type: 'Color', 
          text: '${inText}', 
          preferredSize:[${sizes[1]},25], 
          alignment: ['left','fill']
        }
        color: 0,
        picker: Button { 
          text: 'picker', 
          preferredSize:[${sizes[2]},25]
        }
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
