import van from "vanjs-core";
import * as vanX from "vanjs-ext";
import { Button } from "./button";
import { div } from "./elements";
import { TextField } from "./field/text";
// import { demoDataStr } from "./data";
import { MediaField } from './field/media';
import { ColorField } from './field/color';

const templates = van.state([] as Template[]);
const templateIndex = van.state(0);

//@ts-ignore
const csInterface = new CSInterface();

function doSomething() {
  csInterface.evalScript(`getMenuInfo();`, (res: any) => {
    console.log(res, JSON.parse(res))
    const data = JSON.parse(res);
    templates.val = data.templates;
  });
  // const demoData = JSON.parse(demoDataStr);
  // templates.val = demoData.templates;
}

const fields = () => {
  return vanX.calc(() => {
    const output = div();
    const fields = templates.val[templateIndex.val]?.fields || 0;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      switch (field.type) {
        case "Text":
          van.add(output, TextField(field.title));
          break;
        case "Color":
          van.add(output, ColorField(field.title));
          break;
        case "Font":
        case "Media":
          van.add(output, MediaField(field.title));
          break;
        case "Group":
        default:
          break;
      }
    }

    return output;
  });
};

const templateOptions = vanX.calc(() => {
  return templates.val
    .map((template, index) => {
      console.log("template", template);
      return div(
        { class: `template-option ${templateIndex.val === index ? "selected" : ""}` },
        // h4(template.name),
        Button(template.name, () => (templateIndex.val = index))
      );
    })
    .reduce((acc, curr) => {
      van.add(acc, curr);
      return acc;
    }, div({ class: "template-options" }));
});

// Reusable components can be just pure vanilla JavaScript functions.
// Here we capitalize the first letter to follow React conventions.
const Hello = () => {
  const templateFields = van.derive(() => templates.val.length);
  console.log("templateFields", templateFields.val);
  return div({ class: "hello" }, templateOptions, fields(), Button("Click Me", doSomething));
};

van.add(document.body, Hello());


doSomething();