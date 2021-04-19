import { scriptVersion } from "../package.json";

// START UI CREATION
// MDS
// // ===
function initMain(title) {
  const main = new Window("palette");
  main.text = title;
  main.preferredSize.width = 510;
  main.orientation = "column";
  main.alignChildren = ["center", "top"];
  main.spacing = 10;
  main.margins = 16;
  return main;
}

// HEADER
// ======
function initHeader(parent) {
  const header = parent.add("group", undefined, { name: "header" });
  header.orientation = "column";
  header.alignChildren = ["left", "center"];
  header.spacing = 10;
  header.margins = 0;
  header.alignment = ["fill", "top"];

  const title = header.add("statictext", undefined, undefined, {
    name: "title",
  });
  title.text = `The Sorcerer's Apprentice (v${scriptVersion})`;
  title.alignment = ["fill", "center"];

  return header;
}

// TEMPLATE PANEL (THIS IS WHERE ALL THE GENERATED FIELDS WILL GO)
// ========
function initTemplatePanel(parent) {
  const template = parent.add("tabbedpanel", undefined, undefined, {
    name: "template",
  });
  template.alignChildren = "fill";
  template.preferredSize.width = 479;
  template.margins = 0;
  template.alignment = ["fill", "top"];
  return template;
}
// // OPTIONS
// // =======
function initOptionsPanel(parent) {
  const options = mds.add("group", undefined, { name: "options" });
  options.orientation = "row";
  options.alignChildren = ["left", "center"];
  options.spacing = 10;
  options.margins = 0;
  return options;
}

// STATUS
// ====
function initStatusPanel(parent) {
  const stts = parent.add("group", undefined, { name: "stts" });
  stts.orientation = "column";
  stts.alignChildren = ["center", "center"];
  stts.spacing = 10;
  stts.margins = 0;
  stts.alignment = ["fill", "top"];
}

export default {
  initMain,
  initHeader,
  initTemplatePanel,
  initOptionsPanel,
  initStatusPanel
};
