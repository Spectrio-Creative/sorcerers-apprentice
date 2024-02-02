import { createMainDialog } from "../../classes/MainDialog";
import { TemplateControl } from "../../classes/template/dialog/TemplateControl";

export const {
  mds,
  title: menuTitle,
  compTitle,
  outFolder,
  template,
  compBtn,
  queueBtn,
  renderBtn,
  pbar,
  status,
} = createMainDialog();

export const templateControl = new TemplateControl();
