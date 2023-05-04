import { createMainDialog } from "../../classes/MainDialog";
import { TemplateControl } from "../../classes/template/dialog/TemplateControl";
import { createTemplateMain } from "../../classes/template/dialog/TemplateMain";

const { mds, title, compTitle, outFolder, template, compBtn, queueBtn, renderBtn, pbar, status } = createMainDialog();

const templateMain = createTemplateMain(template);

const templateControl = new TemplateControl();

export {
  mds,
  title as menuTitle,
  compTitle,
  outFolder,
  template,
  compBtn,
  queueBtn,
  renderBtn,
  pbar,
  status,
  templateMain,
  templateControl
};
