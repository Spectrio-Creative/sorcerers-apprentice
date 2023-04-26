import { project } from "../globals/globals";
// import { status } from "../globals/project/menu";
import { compBtn, compTitle, pbar, queueBtn, renderBtn, status, template } from "../globals/project/menu";
// import { libItemsInFolder, libItemsReg, regSafe } from "../tools/ae";
import { findLayers, getPreComps, libItemsInFolder, libItemsReg, regSafe } from "../tools/ae";
import { ITab } from "../uiGroupTemplates";
import { customEach } from "../tools/legacyTools";
import clone from "just-clone";
import { addLinkedPrecomps, prerequisites } from "../legacy/legacyFunctionality";
import { fontStylesMaster } from "../globals/legacySupport";
import { setText } from "../legacy/legacyTextFunctions";
import fillTemplate from "../legacy/legacyFillTemplate";

export type RenderOp = "compOnly" | "aeQueueOnly" | "queueOnly" | "renderAlso";

export interface IRenderer {
  templateChoice: ITab;
  renderOp: RenderOp;
  outFile?: string;
  originalComp: CompItem;
  fontStyles: { [key: string]: string };
  panel: TabbedPanel;
}

export class Renderer implements IRenderer {
  templateChoice: ITab;
  renderOp: RenderOp;
  outFile?: string;
  originalComp: CompItem;
  fontStyles: { [key: string]: string };
  panel: TabbedPanel;

  constructor(templateChoice: ITab, renderOp?: RenderOp, outFile?: string) {
    project.log("Renderer constructor");
    status.text = "Renderer constructor";

    this.templateChoice = templateChoice;
    this.renderOp = renderOp || "compOnly";
    this.outFile = outFile;

    const ORcompFolder: FolderItem = libItemsReg(
      Number(templateChoice.name.match(/[0-9]+$/g)[0]),
      "Folder",
      1
    ) as FolderItem;
    status.text = "Found Comp Folder";
    this.originalComp = libItemsInFolder(regSafe(templateChoice.text), ORcompFolder, "Composition")[0] as CompItem;
    status.text = "Found Original Comp";
  }

  render() {
    status.text = "Renderer render";
    this.mdsRender();
  }

  mdsRender() {
    try {
      this.panel = clone(template[this.templateChoice.name]["content_" + this.templateChoice.text]);
    } catch (e) {
      status.text = e;
    }

    if (prerequisites(this.templateChoice, this.panel) === -1) return;

    const ORcompFolder: FolderItem = libItemsReg(
      Number(this.templateChoice.name.match(/[0-9]+$/g)[0]),
      "Folder",
      1
    ) as FolderItem;
    status.text = "Found Comp Folder";
    const ORcomp = libItemsInFolder(regSafe(this.templateChoice.text), ORcompFolder, "Composition")[0] as CompItem;
    status.text = "Found Original Comp";

    /*pbar.value = 0;
    alert('Made it!'); return;*/
    pbar.value = 25;
    status.text = this.templateChoice.text;

    const comp = ORcomp.duplicate();

    this.fontStyles = fontStylesMaster[ORcomp.id];

    status.text = "Duplicated Comp";
    comp.name = compTitle.txt.text !== "" ? compTitle.txt.text : ORcomp.name;

    status.text = "Renamed Comp '" + comp.name + "'";
    const compFolder = app.project.items.addFolder(comp.name);
    status.text = "Created Folder '" + comp.name + "'";
    let userComps = libItemsReg(/User Comps/g, "Folder")[0];
    if (userComps == undefined) userComps = app.project.items.addFolder("User Comps");

    status.text = "Found or Created 'User Comps' Folder";

    //delete existing folder if needed
    if (libItemsInFolder("^" + regSafe(comp.name) + "$", userComps, "Folder").length > 0) {
      const matchList = libItemsInFolder("^" + regSafe(comp.name) + "$", userComps, "Folder");
      customEach(matchList, function (match) {
        match.remove();
      });
    }
    compFolder.parentFolder = userComps;
    comp.parentFolder = compFolder;

    status.text = comp.name;

    addLinkedPrecomps(ORcompFolder, compFolder, comp);

    pbar.value = 40;

    //Get all compositions from any subfolder containing the word 'Precomps'
    const preComps: CompItem[] = getPreComps(compFolder);
    const allComps = preComps;
    allComps.push(comp);

    //Get all layers in preComps that are linked outward.
    status.text = "Relinking Expressions";

    allComps.forEach((compItem) => {
      const allLayers = findLayers(/.*/g, compItem) as Layer[];
      allLayers.forEach((subLayer) => {
        relinkExp(subLayer, compItem);
      });
    });
    project.log("");

    //Fill template
    fillTemplate({
      comp,
      compFolder,
      renderOp: this.renderOp,
      fontStyles: this.fontStyles,
      panel: this.panel,
      outFile: this.outFile,
    });

    //relink other expressions
    function relinkExp(layer: Layer, compItem: CompItem) {
      for (let i = 1; i <= (layer.property("Effects") as PropertyGroup).numProperties; i++) {
        const matchName = layer.property("Effects").property(i).matchName;

        if (matchName == "ADBE Fill" || matchName == "ADBE Color Control") {
          const colorProperty: Property = layer.property("Effects").property(i).property("Color") as Property;
          if (colorProperty.expressionEnabled) {
            const orExp = colorProperty.expression,
              expressionComp = (orExp.match(/comp\(".*?"\)/) || [""])[0].slice(6, -2);
            let newExp = orExp;

            const exReg = new RegExp(regSafe(expressionComp), "g");
            if (expressionComp === ORcomp.name) {
              newExp = orExp.replace(exReg, comp.name);
            } else {
              customEach(preComps, function (item: CompItem) {
                if (expressionComp === item.name) {
                  item.name = "[" + comp.name + "] " + item.name;
                  newExp = orExp.replace(exReg, item.name);
                } else if (expressionComp === item.name.replace("[" + comp.name + "] ", "")) {
                  newExp = orExp.replace(exReg, item.name);
                }
              });
            }

            (layer.property("Effects").property(i).property("Color") as Property).expression = newExp;
          }
        }
      }

      if (
        layer instanceof TextLayer &&
        layer.property("Source Text") !== undefined &&
        (layer.property("Source Text") as Property).expressionEnabled
      ) {
        const orExp = (layer.property("Source Text") as Property).expression,
          expressionComp = orExp.match(/comp\(".*?"\)/)[0].slice(6, -2);
        let newExp = orExp;

        const textValue = layer.text.sourceText.valueAtTime(0, false);

        if (expressionComp === ORcomp.name) {
          const orReg = new RegExp(regSafe(ORcomp.name), "g");
          newExp = orExp.replace(orReg, comp.name);
        } else {
          customEach(preComps, function (item) {
            if (expressionComp === item.name) {
              item.name = "[" + comp.name + "] " + item.name;
              newExp = orExp.replace(expressionComp, item.name);
            } else if (expressionComp === item.name.replace("[" + comp.name + "] ", "")) {
              newExp = orExp.replace(expressionComp, item.name);
            }
          });
        }

        (layer.property("Source Text") as Property).expression = newExp;

        layer.text.sourceText.expressionEnabled = false;
        setText({
          textLayer: layer,
          comp: compItem,
          newText: textValue.text,
          fontStyles: this.fontStyles,
          panel: this.panel,
        });
        layer.text.sourceText.expressionEnabled = true;
      }
    }

    pbar.value = 100;
    status.text = "Script Finished";
    compBtn.active = true;
    compBtn.active = false;
    renderBtn.enabled = false;
    compBtn.text = "DONE";
    queueBtn.text = "RESET";
    renderBtn.text = "TOTAL RESET";
  }
}
