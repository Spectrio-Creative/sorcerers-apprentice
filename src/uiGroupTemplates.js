// UI Group Templates to use in the UI Set up
// ============

import { arrIndex } from "./tools";

function addTextGroup(gName, label, tab, inText, typeOptions) {
  inText = inText || ["", true];
  typeOptions = typeOptions || ["n"];

  var sizes = tab === "tab" ? [110, 302] : [91, 378],
    multiline = arrIndex(typeOptions, "m") !== -1 ? true : false,
    visible = arrIndex(typeOptions, "v") !== -1 ? true : false,
    h = multiline ? 60 : 25,
    visCheck = !visible
      ? ""
      : "visCheck: Checkbox {text:'',  alignment: ['left','bottom'], preferredSize: [-1, 19], value: " +
        inText[1] +
        "}, \
        ";
  sizes = !visible ? sizes : [82, sizes[1]];
  return (
    "group { \
        name: '" +
    gName +
    "',\
        orientation:'row',\
        alignment:['fill','top'],\
        alignChildren: ['left','center'],\
        spacing: 10,\
        margins: 0,\
        " +
    visCheck +
    "label: StaticText { text:'" +
    label +
    "', preferredSize: [" +
    sizes[0] +
    ", -1]}, \
        txt: EditText { text: '" +
    inText[0] +
    "', preferredSize:[" +
    sizes[1] +
    "," +
    h +
    "], alignment: ['left','fill'], properties: {multiline: " +
    multiline +
    "}}\
    }"
  );
}

function addBrowseGroup(gName, label, tab, inText) {
  inText = inText || ["", true];
  var sizes = tab === "tab" ? [110, 202, 90] : [91, 278, 90];

  return (
    "group { \
        name: '" +
    gName +
    "',\
        orientation:'row',\
        alignment:['fill','top'],\
        alignChildren: ['left','center'],\
        spacing: 10,\
        margins: 0,\
        label: StaticText { text:'" +
    label +
    "', preferredSize: [" +
    sizes[0] +
    ", -1]}, \
        txt: EditText { text: '" +
    inText[0] +
    "', preferredSize:[" +
    sizes[1] +
    ",25], alignment: ['left','fill']}\
        browse: Button { text: 'Browse', preferredSize:[" +
    sizes[2] +
    ",25]}\
    }"
  );
}

function addGroupV(gName, label, tab, inText, opts) {
  inText = inText || ["", true];
  opts = opts || ["n"];
  var sizes = tab === "tab" ? [110, 202, 90] : [91, 278, 90],
    visible = arrIndex(opts, "v") !== -1 ? true : false,
    visCheck = !visible
      ? ""
      : "visCheck: Checkbox {text:'',  alignment: ['left','center'], preferredSize: [-1, 15], value: 'Visible'}, \
        ";
  sizes = !visible ? sizes : [82, sizes[1]];

  return (
    "group { \
        name: '" +
    gName +
    "',\
        orientation:'row',\
        alignment:['fill','top'],\
        alignChildren: ['left','center'],\
        spacing: 10,\
        margins: 0,\
        " +
    visCheck +
    "label: StaticText { text:'" +
    label +
    "', preferredSize: [" +
    sizes[0] +
    ", -1]}, \
        img: EditText { text: '" +
    inText[0] +
    "', preferredSize:[" +
    sizes[1] +
    ",25], alignment: ['left','fill']}\
        browse: Button { text: 'Browse', preferredSize:[" +
    sizes[2] +
    ",25]}\
    }"
  );
}

function addMediaGroup(gName, label, tab, inText, opts) {
  inText = inText || ["", true];
  opts = opts || ["n"];
  var sizes = tab === "tab" ? [110, 202, 90] : [91, 278, 90],
    visible = arrIndex(opts, "v") !== -1 ? true : false,
    visCheck = !visible
      ? ""
      : "visCheck: Checkbox {text:'',  alignment: ['left','center'], preferredSize: [-1, 15], value: " +
        inText[1] +
        "}, \
        ";
  sizes = !visible ? sizes : [82, sizes[1]];

  return (
    "group { \
        name: '" +
    gName +
    "',\
        orientation:'row',\
        alignment:['fill','top'],\
        alignChildren: ['left','center'],\
        spacing: 10,\
        margins: 0,\
        " +
    visCheck +
    "label: StaticText { text:'" +
    label +
    "', preferredSize: [" +
    sizes[0] +
    ", -1]}, \
        img: EditText { text: '" +
    inText[0] +
    "', preferredSize:[" +
    sizes[1] +
    ",25], alignment: ['left','fill']}\
        browse: Button { text: 'Browse', preferredSize:[" +
    sizes[2] +
    ",25]}\
    }"
  );
}

function addColorGroup(gName, label, tab, inText) {
  var sizes = tab === "tab" ? [110, 202, 90] : [91, 278, 90];
  inText = inText || "";
  return (
    "group { \
        name: '" +
    gName +
    "',\
        orientation:'row',\
        alignment:['fill','top'],\
        alignChildren: ['left','center'],\
        spacing: 10,\
        margins: 0,\
        label: StaticText { text:'" +
    label +
    "', preferredSize: [" +
    sizes[0] +
    ", -1]}, \
        txt: EditText { text: '" +
    inText +
    "', preferredSize:[" +
    sizes[1] +
    ",25], alignment: ['left','fill']}\
        color: 0,\
        picker: Button { text: 'picker', preferredSize:[" +
    sizes[2] +
    ",25]}\
    }"
  );
}

function addTab(tName, label) {
  return (
    "tab {\
        text: '" +
    label +
    "', name: '" +
    tName +
    "', orientation: 'column', spacing: 10, margins: 10, \
        alignChildren: ['left','top'],\
    }"
  );
}

function addTabbedPannel(tName) {
  return (
    "tabbedpanel {\
        name: '" +
    tName +
    "', alignChildren: 'fill', preferredSize: [455, -1], margins: 0, \
        alignment: ['fill','top'],\
    }"
  );
}

export default {
  addBrowseGroup,
  addColorGroup,
  addGroupV,
  addMediaGroup,
  addTab,
  addTabbedPannel,
  addTextGroup,
};