// UI Group Templates to use in the UI Set up
// ============

function addTextGroup(groupName:string, label:string, tab = "", inText:[string, boolean] = ["", true], typeOptions:string[] = ["n"]) {
  let sizes = tab === "tab" ? [110, 302] : [91, 378];
  const multiline = typeOptions.indexOf("m") !== -1 ? true : false;
  const visible = typeOptions.indexOf("v") !== -1 ? true : false;
  const h = multiline ? 60 : 25;
  const visibilityToggle = `visibilityToggle: Checkbox {
    text:'',
    alignment: ['left','bottom'],
    preferredSize: [-1, 19],
    value: ${inText[1]}
  }, \n`;

  sizes = !visible ? sizes : [82, sizes[1]];
  return `group {
        name: '${groupName}',
        ss_type: 'Text Group',
        orientation:'row',
        alignment:['fill','top'],
        alignChildren: ['left','center'],
        spacing: 10,
        margins: 0,
        ${visible ? visibilityToggle : ""}
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

function addBrowseGroup(groupName:string, label:string, tab:"tab"|"" = "", inText:[string, boolean] = ["", true]) {
  const sizes = tab === "tab" ? [110, 202, 90] : [91, 278, 90];

  return `group { 
        name: '${groupName}',
        ss_type: 'Browse Group',
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
          ss_type: 'File',
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

function addMediaGroup(groupName:string, label:string, tab:string, inText:[string, boolean] = ["", true], opts:string[] = ["n"]) {
  let sizes = tab === "tab" ? [110, 202, 90] : [91, 278, 90];
  const visible = opts.indexOf( "v") !== -1 ? true : false;
  const visibilityToggle = `visibilityToggle: Checkbox {
    text:'',
    alignment: ['left','center'],
    preferredSize: [-1, 15],
    value: ${inText[1]}
  } \n`;

  sizes = !visible ? sizes : [82, sizes[1]];

  return `group { 
        name: '${groupName}', 
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

function addColorGroup(groupName:string, label:string, tab:string, inText = "") {
  const sizes = tab === "tab" ? [110, 202, 90] : [91, 278, 90];
  return `group { 
        name: '${groupName}',
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

function addTab(tabName:string, label:string) {
  return `tab {
        text: '${label}', 
        name: '${tabName}', 
        ss_type: 'Tab', 
        orientation: 'column', 
        spacing: 10, margins: 10, 
        alignChildren: ['left','top'],
    }`;
}

function addTabbedPannel(tabName:string) {
  return `tabbedpanel {
        name: '${tabName}', 
        ss_type: 'Tabbed Pannel', 
        alignChildren: 'fill', 
        preferredSize: [455, -1], margins: 0, 
        alignment: ['fill','top'],
    }`;
}

export default {
  addBrowseGroup,
  addColorGroup,
  addMediaGroup,
  addTab,
  addTabbedPannel,
  addTextGroup,
};
