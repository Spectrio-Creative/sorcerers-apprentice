import { TemplateMain } from "./classes/template/TemplateMain";
import polyfill from "./tools/polyfill";

polyfill();

const template = new TemplateMain();

export function getMenuInfo() {
  return JSON.stringify(template.getOverview());
}

export function setValuesFromList(list: string) {
  const parsed: InputTemplateValue[] = JSON.parse(list);
  template.setValuesFromList(parsed);
}

export function showMenu() {
  template.showMenuPanel();
}

const file = new File("~/Desktop/MenuInfo.json");
file.open("w");
file.write(getMenuInfo());
file.close();

setValuesFromList(
  JSON.stringify([
    {
      templateName: "Boogle Pie",
      compName: "Boogle 2000",
      fields: [
        {
          title: "A Whole Wheel of Fish",
          type: "Text",
          value: "Boogle 2000",
        },
        {
          title: "Background",
          type: "Media",
          value: "stars.png",
        },
        {
          title: "Font",
          type: "Font",
          value: "Arial",
        },
        {
          title: "Hue",
          type: "Color",
          value: "rgb(255, 255, 255)",
        },

      ],
    },
    {
      templateName: "Erything",
      compName: "Erything 3000",
      fields: [
        {
          title: "A Whole Wheel of Fish",
          type: "Text",
          value: "Space 8000",
        },
        {
          title: "Text Color",
          type: "Color",
          value: "#4d9fa1",
        },
        {
          title: "Second Color",
          type: "Color",
          value: "#7761be",
        },
        {
          title: "Heading",
          type: "Font",
          value: "Montserrat-Thin",
        },
        {
          title: "First Background",
          type: "Media",
          value: "mountain1.jpg",
        },
        {
          title: "Second Background",
          type: "Media",
          value: "mountain2.jpg",
        },
      ]
    }
  ] as InputTemplateValue[])
);

// showMenu();
