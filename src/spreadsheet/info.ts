const showSpreadSheetInfo = () => {
  /*
    Code for Import https://scriptui.joonas.me — (Triple click to select): 
    {"activeId":68,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"text":"The Sorcerer’s Apprentice","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"],"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"enabled":true}},"item-19":{"id":19,"type":"Group","parentId":0,"style":{"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null,"varName":null,"enabled":true}},"item-45":{"id":45,"type":"Panel","parentId":19,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"About Spreadsheet Export","preferredSize":[300,0],"margins":[15,20,10,20],"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-68":{"id":68,"type":"StaticText","parentId":45,"style":{"enabled":true,"varName":"csvExport","creationProps":{"truncate":"none","multiline":true,"scrolling":false},"softWrap":false,"text":"- Single CSV Export is optimal only if you’re using templates that have nearly the same properties and property names.","justify":"left","preferredSize":[255,0],"alignment":null,"helpTip":null}}},"order":[0,19,45,68],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"functionWrapper":false,"compactCode":false,"showDialog":true,"afterEffectsDockable":false,"itemReferenceList":"None"}}
    */

  // DIALOG
  // ======
  const infoDialog = new Window("dialog", undefined, undefined, { closeButton: true });
  infoDialog.text = "Spreadsheet Export Info";
  infoDialog.orientation = "column";
  infoDialog.alignChildren = "center";
  infoDialog.spacing = 10;
  infoDialog.margins = 16;

  // GROUP1
  // ======
  const infoGroup1 = infoDialog.add("group", undefined, { name: "infoGroup1" });
  infoGroup1.orientation = "column";
  infoGroup1.alignChildren = ["left", "top"];
  infoGroup1.spacing = 10;
  infoGroup1.margins = 0;

  // PANEL1
  // ======
  const infoPanel1 = infoGroup1.add("panel", undefined, undefined, { name: "infoPanel1" });
  //   infoPanel1.text = "About Spreadsheet Export";
  infoPanel1.preferredSize.width = 300;
  infoPanel1.orientation = "column";
  infoPanel1.alignChildren = "left";
  infoPanel1.spacing = 10;
  infoPanel1.margins = [20, 15, 20, 10];

  const csvExport = infoPanel1.add("statictext", undefined, undefined, {
    name: "csvExport",
    multiline: true,
  });
  csvExport.text =
    "- Single CSV Export is optimal only if you’re using templates that have nearly the same properties and property names.";
  csvExport.preferredSize.width = 255;

  const infoDone = infoDialog.add("button", undefined, undefined, { name: "infoDone" });
  infoDone.onClick = () => {
    infoDialog.close();
  };
  infoDone.text = "CLOSE";

  infoDialog.show();
};

export { showSpreadSheetInfo };
