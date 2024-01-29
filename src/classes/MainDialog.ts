import { project } from "../globals/globals";
import * as ui from "../uiGroupTemplates";

const createMainDialog = () => {
  // UI Group Templates to use in the UI Set up
  // ============

  // START UI CREATION
  // MDS
  // ===
  const mds = new Window("palette");
  mds.text = "THE SORCERER'S APPRENTICE";
  mds.preferredSize.width = 510;
  mds.orientation = "column";
  mds.alignChildren = "center";
  mds.spacing = 10;
  mds.margins = 16;

  // HEADER
  // ======
  const header = mds.add("group", undefined, { name: "header" });
  header.orientation = "column";
  header.alignChildren = ["left", "center"];
  header.spacing = 10;
  header.margins = 0;
  header.alignment = ["fill", "top"];

  const title = header.add("statictext", undefined, undefined, { name: "title" });
  const version = project ? project.version ? project.version : "0" : "0";
  title.text = `The Sorcerer's Apprentice (v${version})`;
  title.alignment = ["fill", "center"];

  const compTitle = header.add(ui.addTextGroup("compTitle", "Comp Title:") as "treeview") as TextGroup;
  const outFolder = header.add(ui.addBrowseGroup("outFolder", "Output File") as "treeview") as BrowseGroup;

  // TEMPLATE PANEL (THIS IS WHERE ALL THE GENERATED FIELDS WILL GO)
  // ========
  const template:TabbedPanel = mds.add("tabbedpanel", undefined, undefined, { name: "template" });
  template.preferredSize.width = 479;
  template.alignment = ["fill", "top"];

  // OPTIONS
  // =======
  const options = mds.add("group", undefined, { name: "options" });
  options.orientation = "row";
  options.alignChildren = ["left", "center"];
  options.spacing = 10;
  options.margins = 0;

  const compBtn = options.add("button", undefined, undefined, { name: "compBtn" });
  compBtn.text = "Create Comp";

  const queueBtn = options.add("button", undefined, undefined, { name: "queueBtn" });
  queueBtn.text = "Queue In AME";

  const renderBtn = options.add("button", undefined, undefined, { name: "renderBtn" });
  //renderBtn.enabled = false;
  renderBtn.text = "Render In AME";

  // DIVIDER
  // ===
  const divider1 = mds.add("panel", undefined, undefined, { name: "divider1" });
  divider1.alignment = "fill";

  // STATUS
  // ====
  const stts = mds.add("group", undefined, { name: "stts" });
  stts.orientation = "column";
  stts.alignChildren = ["center", "center"];
  stts.spacing = 10;
  stts.margins = 0;
  stts.alignment = ["fill", "top"];

  const pbar = stts.add("progressbar", undefined, 0, 100, { name: "pbar" });
  pbar.preferredSize.width = 480;

  const status = stts.add("statictext", undefined, undefined, { name: "status" });
  status.text = "Status Text";
  //status.graphics.font = "dialog:24";
  status.preferredSize.width = 470;

  return {
    mds,
    header,
    title,
    compTitle,
    outFolder,
    template,
    options,
    compBtn,
    queueBtn,
    renderBtn,
    divider1,
    stts,
    pbar,
    status,
  };
};

export { createMainDialog };
