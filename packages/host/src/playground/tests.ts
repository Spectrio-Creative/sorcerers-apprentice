import type { TemplateMain } from "../classes/template/TemplateMain";

export const testIt = (template: TemplateMain) => {
  function setValuesFromList(list: string) {
    const parsed: InputTemplateValue[] = JSON.parse(list);
    template.setValuesFromList(parsed);
  }

  setValuesFromList(
    JSON.stringify([
      {
        id: "UHLHfXi7UzYEFEXVRcU12",
        templateId: 1583,
        templateName: "Specialist",
        compName: "Specialist",
        status: "Ready",
        fields: [
          { title: "Name", value: "Biggle Bee", type: "Text", fullTitle: "!T [All Info] Name", hidden: true },
          { title: "Title", value: "The Queen", type: "Text", fullTitle: "!T [All Info] Title", hidden: true },
          {
            title: "Office Phone",
            value: "123-456-7890 (Office)",
            type: "Text",
            fullTitle: "!T [All Info] Office Phone",
            hidden: true,
          },
          {
            title: "Cell Phone",
            value: "123-456-7890 (Cell)",
            type: "Text",
            fullTitle: "!T [All Info] Cell Phone",
            hidden: true,
          },
          {
            title: "Address",
            value: "123 Street, Overlook City",
            type: "Text",
            fullTitle: "!T [All Info] Address",
            hidden: true,
          },
          {
            title: "Email",
            value: "bigglebee@onetwothree.com",
            type: "Text",
            fullTitle: "!T [All Info] Email",
            hidden: true,
          },
          { title: "NMLS#", value: "NMLS# 123456", type: "Text", fullTitle: "!T [All Info] NMLS#", hidden: false },
          {
            title: "Third Section Bullet 1",
            value: "•\tSomething",
            type: "Text",
            fullTitle: "!T Third Section Bullet 1",
            hidden: false,
          },
          {
            title: "Third Section Bullet 2",
            value: "•\tSomething else",
            type: "Text",
            fullTitle: "!T Third Section Bullet 2",
            hidden: false,
          },
          {
            title: "Third Section Bullet 3",
            value: "•\tStill yet another",
            type: "Text",
            fullTitle: "!T Third Section Bullet 3",
            hidden: false,
          },
          {
            title: "Third Section Bullet 4",
            value: "•\tDid I mention there's more",
            type: "Text",
            fullTitle: "!T Third Section Bullet 4",
            hidden: false,
          },
          {
            title: "Third Section Bullet 5",
            value: "•\tOkay okay okay",
            type: "Text",
            fullTitle: "!T Third Section Bullet 5",
            hidden: false,
          },
          {
            title: "Third Section Bullet 6",
            value: "•\tThat's all I have to say",
            type: "Text",
            fullTitle: "!T Third Section Bullet 6",
            hidden: false,
          },
          {
            title: "Third Section Title",
            value: "Our Bee Loan services include:",
            type: "Text",
            fullTitle: "!T Third Section Title",
            hidden: false,
          },
          {
            title: "Disclaimer",
            value: "1 Money money grows on trees, money money has no knees",
            type: "Text",
            fullTitle: "!T Disclaimer",
            hidden: false,
          },
          { title: "Image", value: "Gary Massey.jpg", type: "Media", fullTitle: "!I Image", hidden: false },
        ],
      },
    ] as InputTemplateValue[])
  );
};
