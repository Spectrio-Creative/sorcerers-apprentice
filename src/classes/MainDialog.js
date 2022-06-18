import { project } from "../globals/globals";
import ui from "../uiGroupTemplates";

const createMainDialog = () => {
  // UI Group Templates to use in the UI Set up
  // ============

  // START UI CREATION
  // MDS
  // ===
  var mds = new Window("palette");
  mds.text = "THE SORCERER'S APPRENTICE";
  mds.preferredSize.width = 510;
  mds.orientation = "column";
  mds.alignChildren = ["center", "top"];
  mds.spacing = 10;
  mds.margins = 16;

  // HEADER
  // ======
  var header = mds.add("group", undefined, { name: "header" });
  header.orientation = "column";
  header.alignChildren = ["left", "center"];
  header.spacing = 10;
  header.margins = 0;
  header.alignment = ["fill", "top"];

  var title = header.add("statictext", undefined, undefined, { name: "title" });
  title.text = `The Sorcerer's Apprentice (v${project.initialDialog.version})`;
  title.alignment = ["fill", "center"];

  var compTitle = header.add(ui.addTextGroup("compTitle", "Comp Title:"));
  var outFolder = header.add(ui.addBrowseGroup("outFolder", "Output File"));

  // TEMPLATE PANEL (THIS IS WHERE ALL THE GENERATED FIELDS WILL GO)
  // ========
  var template = mds.add("tabbedpanel", undefined, undefined, { name: "template" });
  template.alignChildren = "fill";
  template.preferredSize.width = 479;
  template.margins = 0;
  template.alignment = ["fill", "top"];

  // OPTIONS
  // =======
  var options = mds.add("group", undefined, { name: "options" });
  options.orientation = "row";
  options.alignChildren = ["left", "center"];
  options.spacing = 10;
  options.margins = 0;

  var compBtn = options.add("button", undefined, undefined, { name: "compBtn" });
  compBtn.text = "Create Comp";

  var queueBtn = options.add("button", undefined, undefined, { name: "queueBtn" });
  queueBtn.text = "Queue In AME";

  var renderBtn = options.add("button", undefined, undefined, { name: "renderBtn" });
  //renderBtn.enabled = false;
  renderBtn.text = "Render In AME";

  // DIVIDER
  // ===
  var divider1 = mds.add("panel", undefined, undefined, { name: "divider1" });
  divider1.alignment = "fill";

  // STATUS
  // ====
  var stts = mds.add("group", undefined, { name: "stts" });
  stts.orientation = "column";
  stts.alignChildren = ["center", "center"];
  stts.spacing = 10;
  stts.margins = 0;
  stts.alignment = ["fill", "top"];

  var pbar = stts.add("progressbar", undefined, 0, 100, { name: "pbar" });
  pbar.preferredSize.width = 480;

  var status = stts.add("statictext", undefined, undefined, { name: "status" });
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
