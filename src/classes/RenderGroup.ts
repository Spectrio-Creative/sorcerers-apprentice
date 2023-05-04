// import { template } from '../globals/project/menu';
import { project } from "../globals/globals";
import { status, template } from "../globals/project/menu";
import { ITab } from "../uiGroupTemplates";
import { Renderer } from "./Renderer";

const templateReg = /^t([\w ]+)_(\d+)$/;

export class RenderGroup {
  templates: ITab[];
  templateLookup: { [key: string]: { id: string; name: string } };
  renderers: { [key: string]: Renderer };

  constructor() {
    this.templates = [];
    this.templateLookup = {};
    this.renderers = {};
  }

  getRenderer(templateName: string) {
    let templateKey = templateName;

    if (!templateReg.test(templateName)) {
      templateKey =
        Object.keys(this.templateLookup).find((key) => {
          return this.templateLookup[key].name === templateName;
        }) || templateName;
    }

    if (Object.keys(this.renderers).includes(templateKey)) return this.renderers[templateKey];
  }

  addRenderer(templateKey: string, renderer: Renderer) {
    const templateName = templateKey.replace(templateReg, "$1");
    const templateId = templateKey.replace(templateReg, "$2");
    this.renderers[templateKey] = renderer;
    this.templateLookup[templateKey] = { id: templateId, name: templateName };
  }

  createRenderersFromTemplate() {
    project.log("createRenderersFromTemplate");
    status.text = "createRenderersFromTemplate";

    Object.keys(template).forEach((templateKey) => {
      if (!templateReg.test(templateKey)) return;
      const renderer = new Renderer(template[templateKey]);
      this.addRenderer(templateKey, renderer);
    });
  }

  alertUserOfAllRenderers() {
    project.log("alertUserOfAllRenderers");
    status.text = "alertUserOfAllRenderers";

    const rendererNames = Object.keys(this.renderers);
    const rendererNamesString = rendererNames.join(", ");
    alert(rendererNamesString);
  }
}
