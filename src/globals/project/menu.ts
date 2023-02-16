import { createMainDialog } from "../../classes/MainDialog";
import { createTemplateMain } from "../../classes/template/dialog/TemplateMain";

const { mds, title, compTitle, outFolder, template, compBtn, queueBtn, renderBtn, pbar, status } =
  createMainDialog();

const templateMain = createTemplateMain(template);

export { mds, title as menuTitle, compTitle, outFolder, template, compBtn, queueBtn, renderBtn, pbar, status, templateMain };