import { TemplateMain } from "../classes/TemplateMain";

import { parseLayerName } from "../tools/templates";

export function templateClass() {
  const template = new TemplateMain();

  alert(template.printNames());

  const title = "!Ib [Overview] Second Background";
  const title2 = "!T(Heading) [Overview] A Part Wheel of Fish";

  let matches = parseLayerName(title);
  alert("parse:\n" + JSON.stringify(matches));

  matches = parseLayerName(title2);
  alert("parse:\n" + JSON.stringify(matches));
}
