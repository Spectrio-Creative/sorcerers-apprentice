import { renderMain } from "../globals/project/renderMain";
import {
  mds,
  menuTitle as title,
  compTitle,
  outFolder,
  template,
  compBtn,
  queueBtn,
  renderBtn,
  pbar,
  status,
} from "../globals/project/menu";
import { InnerTab } from "../uiGroupTemplates";

export class TraditionalRenderDialog {
  mds: Window;
  title: StaticText;
  compTitle: TextGroup;
  outFolder: BrowseGroup;
  template: TabbedPanel;
  compBtn: Button;
  queueBtn: Button;
  renderBtn: Button;
  pbar: Progressbar;
  status: StaticText;

  constructor() {
    //         const { mds, title, compTitle, outFolder, template, compBtn, queueBtn, renderBtn, pbar, status } =
    //   createMainDialog();

    this.mds = mds;
    this.title = title;
    this.compTitle = compTitle;
    this.outFolder = outFolder;
    this.template = template;
    this.compBtn = compBtn;
    this.queueBtn = queueBtn;
    this.renderBtn = renderBtn;
    this.pbar = pbar;
    this.status = status;

    this.setButtonFunctionality();
  }

  resetMenu() {
    this.compBtn.text = "Create Comp";
    this.queueBtn.text = "Queue In AME";
    this.renderBtn.text = "Render In AME";
    this.pbar.value = 0;
    this.renderBtn.enabled = true;
  }

  clearActiveStates() {
    this.compBtn.active = true;
    this.compBtn.active = false;
    this.queueBtn.active = true;
    this.queueBtn.active = false;
    this.renderBtn.active = true;
    this.renderBtn.active = false;
  }

  setButtonFunctionality() {
    // const clearActiveStates = this.clearActiveStates.bind(this);
    // const resetMenu = this.resetMenu.bind(this);

    compBtn.onClick = () => {
      this.clearActiveStates();
      if (pbar.value === 100) {
        mds.close();
        return;
      }

      const renderer = renderMain.getRenderer((template.selection as InnerTab).name);
      renderer.renderOp = "compOnly";
      renderer.render();
    };

    queueBtn.onClick = () => {
      this.clearActiveStates();
      if (pbar.value === 100) {
        this.resetMenu();
        return;
      }

      if (outFolder.txt.text === "") {
        alert("Please select an output folder");
        return;
      }

      const renderer = renderMain.getRenderer((template.selection as InnerTab).name);
      renderer.renderOp = "queueOnly";
      renderer.outFile = outFolder.txt.text;
      renderer.render();
    };

    renderBtn.onClick = () => {
      this.clearActiveStates();
      if (pbar.value === 100) {
        this.resetMenu();
        return;
      }

      if (outFolder.txt.text === "") {
        alert("Please select an output folder");
        return;
      }

      const renderer = renderMain.getRenderer((template.selection as InnerTab).name);
      renderer.renderOp = "renderAlso";
      renderer.outFile = outFolder.txt.text;
      renderer.render();
    };
  }

  show() {
    this.mds.show();
  }
}
