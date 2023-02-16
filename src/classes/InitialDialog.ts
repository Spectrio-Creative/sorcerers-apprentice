const createInitialDialog = (version) => {
  return {
    version: version || "0.0.0",
    canceled: false,
    success: false,
    canExport: false,
    exportType: "Traditional",
    location: "~/",

    checkLocation: function (location) {
      const result = location !== null;
      this.location = location || this.location;
      return result;
    },

    show: function () {
      /*
      Code for Import https://scriptui.joonas.me — (Triple click to select): 
      {"activeId":37,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"text":"The Sorcerer’s Apprentice","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"],"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"enabled":true}},"item-19":{"id":19,"type":"Group","parentId":0,"style":{"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null,"varName":null,"enabled":true}},"item-36":{"id":36,"type":"Group","parentId":0,"style":{"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["center","top"],"alignment":null,"varName":"finished","enabled":true}},"item-37":{"id":37,"type":"Button","parentId":36,"style":{"text":"CONTINUE","justify":"center","preferredSize":[0,0],"alignment":null,"varName":"continue","helpTip":null,"enabled":true}},"item-45":{"id":45,"type":"Panel","parentId":19,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Version Info","preferredSize":[380,0],"margins":[15,10,10,10],"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-50":{"id":50,"type":"Button","parentId":36,"style":{"enabled":true,"varName":"cancel","text":"CANCEL","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-52":{"id":52,"type":"Group","parentId":45,"style":{"enabled":true,"varName":"exportModeGroup","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-53":{"id":53,"type":"Group","parentId":52,"style":{"enabled":true,"varName":"exportModeTextGroup","preferredSize":[175,20],"margins":0,"orientation":"row","spacing":10,"alignChildren":["right","center"],"alignment":null}},"item-54":{"id":54,"type":"StaticText","parentId":53,"style":{"enabled":true,"varName":"exportModeText","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Export Mode","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-59":{"id":59,"type":"DropDownList","parentId":52,"style":{"enabled":true,"varName":"exportMode","text":"DropDownList","listItems":"Traditional, -, Spreadsheet","preferredSize":[0,0],"alignment":null,"selection":0,"helpTip":null}}},"order":[0,19,45,52,53,54,59,36,37,50],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"functionWrapper":false,"compactCode":false,"showDialog":true,"afterEffectsDockable":false,"itemReferenceList":"None"}}
      */

      // DIALOG
      // ======
      var dialog = new Window("dialog");
      dialog.text = "The Sorcerer’s Apprentice";
      dialog.orientation = "column";
      dialog.alignChildren = ["center", "top"];
      dialog.spacing = 10;
      dialog.margins = 16;

      // GROUP1
      // ======
      var group1 = dialog.add("group", undefined, { name: "group1" });
      group1.orientation = "column";
      group1.alignChildren = ["left", "top"];
      group1.spacing = 10;
      group1.margins = 0;

      // PANEL1
      // ======
      var panel1 = group1.add("panel", undefined, undefined, { name: "panel1" });
      panel1.text = `The Sorcerer‘s Apprentice v${this.version}`;
      panel1.preferredSize.width = 380;
      panel1.orientation = "column";
      panel1.alignChildren = ["left", "top"];
      panel1.spacing = 10;
      panel1.margins = [10, 15, 10, 10];

      // EXPORTMODEGROUP
      // ===============
      var exportModeGroup = panel1.add("group", undefined, { name: "exportModeGroup" });
      exportModeGroup.orientation = "row";
      exportModeGroup.alignChildren = ["left", "center"];
      exportModeGroup.spacing = 10;
      exportModeGroup.margins = 0;

      // EXPORTMODETEXTGROUP
      // ===================
      var exportModeTextGroup = exportModeGroup.add("group", undefined, {
        name: "exportModeTextGroup",
      });
      exportModeTextGroup.preferredSize.width = 175;
      exportModeTextGroup.preferredSize.height = 20;
      exportModeTextGroup.orientation = "row";
      exportModeTextGroup.alignChildren = ["right", "center"];
      exportModeTextGroup.spacing = 10;
      exportModeTextGroup.margins = 0;

      var exportModeText = exportModeTextGroup.add("statictext", undefined, undefined, {
        name: "exportModeText",
      });
      exportModeText.text = "Export Mode";

      // EXPORTMODEGROUP
      // ===============
      var exportMode_array = ["Traditional", "Spreadsheet"];
      var exportMode = exportModeGroup.add("dropdownlist", undefined, undefined, {
        name: "exportMode",
        items: exportMode_array,
      });
      exportMode.selection = 0;

      // FINISHED
      // ========
      var finished = dialog.add("group", undefined, { name: "finished" });
      finished.orientation = "row";
      finished.alignChildren = ["center", "top"];
      finished.spacing = 10;
      finished.margins = 0;

      var cont = finished.add("button", undefined, undefined, { name: "continue" });
      cont.onClick = () => {
        // this.screenChoice = screenChoices_array[screenChoices.selection.index];
        this.exportType = exportMode_array[exportMode.selection.index];
        this.success = true;
        dialog.close();
      };
      cont.text = "CONTINUE";

      var cancel = finished.add("button", undefined, undefined, { name: "cancel" });
      cancel.onClick = () => {
        this.success = false;
        this.canceled = true;
        dialog.close();
      };
      cancel.text = "CANCEL";

      dialog.show();
    },

    getScreenChoice: function () {
      return this.screenChoice;
    },

    getExportType: function () {
      return this.exportType;
    },
  };
};

export { createInitialDialog };
