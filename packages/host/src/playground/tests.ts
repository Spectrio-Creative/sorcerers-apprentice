import type { TemplateMain } from "../classes/template/TemplateMain";

export const testIt = (template: TemplateMain) => {
  // function getMenuInfo() {
  //   return JSON.stringify(template.getOverview());
  // }

  // const file = new File("~/Desktop/MenuInfo.json");
  // file.open("w");
  // file.write(getMenuInfo());
  // file.close();

  function setValuesFromList(list: string) {
    const parsed: InputTemplateValue[] = JSON.parse(list);
    template.setValuesFromList(parsed);
  }

  setValuesFromList(
    JSON.stringify([
      {
        templateName: "Fish",
        compName: "Fish 3000",
        fields: [
          {
            title: "Weird Vid",
            type: "Media",
            value: "buttercups.jpg",
          }
        ],
      },
      {
        id: "O8a0NALfgu2eyKvn6Usl7",
        templateId: 120,
        templateName: "Fish",
        compName: "This is the Fish",
        status: "Complete",
        fields: [
          { title: "Heading", value: "Montserrat-ExtraLight" },
          { title: "A Part Wheel of Fish", value: "A Whole Wheel" },
          { title: "Subtext 1", value: "Integer posuere erat a ante venenatis dapibus posuere velit aliquet." },
          { title: "Weird Vid", type: "Media", value: "mountain1.jpg" },
          { title: "A Whole Wheel of Fish", value: "A New Wheel of Fish" },
          { title: "Subtext 2", value: "Maecenas faucibus mollis interdum." },
          { title: "Second Background", value: "buttercups.jpg" },
          { title: "First Background", value: "beach1.jpg" },
          { title: "Text Color", value: "#9D5797" },
          { title: "Second Color", value: "#608AA2" },
        ],
        outputFile: "~/",
      },
      {
        id: "zFcYP90DcTOrtaKgiuhtx",
        templateId: 120,
        templateName: "Fish",
        compName: "Those are the fish",
        status: "Complete",
        fields: [
          { title: "Heading", value: "Montserrat-Light" },
          { title: "A Part Wheel of Fish", value: "A Wheel of Fish" },
          { title: "Subtext 1", value: "Maecenas faucibus mollis interdum." },
          { title: "Weird Vid", value: "mountain3.jpg" },
          { title: "A Whole Wheel of Fish", value: "A Whole School of Fish" },
          { title: "Subtext 2", value: "Curabitur blandit tempus porttitor." },
          { title: "Second Background", value: "mountain3.jpg" },
          { title: "First Background", value: "beach2.jpg" },
          { title: "Text Color", value: "#367BA3FF" },
          { title: "Second Color", value: "#8036A3FF" },
        ],
        outputFile: "~/",
      },
    ] as InputTemplateValue[])
  );
  // setValuesFromList(
  //   JSON.stringify([
  //     // {
  //     //   templateName: "Boogle Pie",
  //     //   compName: "Boogle 2000",
  //     //   fields: [
  //     //     {
  //     //       title: "A Whole Wheel of Fish",
  //     //       type: "Text",
  //     //       value: "Boogle 2000",
  //     //     },
  //     //     {
  //     //       title: "Background",
  //     //       type: "Media",
  //     //       value: "stars.png",
  //     //     },
  //     //     {
  //     //       title: "Font",
  //     //       type: "Font",
  //     //       value: "Arial",
  //     //     },
  //     //     {
  //     //       title: "Hue",
  //     //       type: "Color",
  //     //       value: "rgb(255, 255, 255)",
  //     //     },
  //     //   ],
  //     // },
  //     // {
  //     //   templateName: "Erything",
  //     //   compName: "Erything 3000",
  //     //   fields: [
  //     //     {
  //     //       title: "A Whole Wheel of Fish",
  //     //       type: "Text",
  //     //       value: "Space 8000",
  //     //     },
  //     //     {
  //     //       title: "Text Color",
  //     //       type: "Color",
  //     //       value: "#4d9fa1",
  //     //     },
  //     //     {
  //     //       title: "Second Color",
  //     //       type: "Color",
  //     //       value: "#7761be",
  //     //     },
  //     //     {
  //     //       title: "Heading",
  //     //       type: "Font",
  //     //       value: "Montserrat-Thin",
  //     //     },
  //     //     {
  //     //       title: "First Background",
  //     //       type: "Media",
  //     //       value: "mountain1.jpg",
  //     //     },
  //     //     {
  //     //       title: "Second Background",
  //     //       type: "Media",
  //     //       value: "mountain2.jpg",
  //     //     },
  //     //   ],
  //     // },
  // {
  //   templateName: "Fish",
  //   compName: "Fish 3000",
  //   fields: [
  //     {
  //       title: "Weird Vid",
  //       type: "Media",
  //       value: "mountain1.jpg",
  //     }
  //   ],
  // },
  //   ] as InputTemplateValue[])
  // );
};
