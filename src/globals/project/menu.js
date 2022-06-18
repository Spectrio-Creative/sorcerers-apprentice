import { createMainDialog } from "../../classes/MainDialog";
import { createTemplateMain } from "../../classes/template/dialog/TemplateMain";

const { mds, compTitle, outFolder, template, compBtn, queueBtn, renderBtn, pbar, status } =
  createMainDialog();

const templateMain = createTemplateMain(template);

export { mds, compTitle, outFolder, template, compBtn, queueBtn, renderBtn, pbar, status, templateMain };
