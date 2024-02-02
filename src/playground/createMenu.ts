import { TemplateMain } from "../classes/template/TemplateMain";
import { TraditionalRenderDialog } from "../classes/TraditionalRenderDialog";
import { prepare } from "../tools/setup";

export function createMenu() {
  prepare();

  const renderDialog = new TraditionalRenderDialog();
  const template = new TemplateMain();

  //   template.createMenuPanel();

  template.templates.forEach((template) => {
    template.createMenuTab(renderDialog.template);

    template.editableFields.forEach((field) => {
      template.addFieldToMenu(field);
    });
  });

  renderDialog.show();
}
