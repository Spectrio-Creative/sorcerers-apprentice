import type { TemplateMain } from "../classes/template/TemplateMain";

export const testIt = (template: TemplateMain) => {
  function setValuesFromList(list: string) {
    const parsed: InputTemplateValue[] = JSON.parse(list);
    template.setValuesFromList(parsed);
  }

  setValuesFromList(
    JSON.stringify([
      {
        id: "xfBDTI8H4h5560L0demCR",
        templateId: 1583,
        templateName: "Specialist",
        compName: "New boo",
        status: "Complete",
        fields: [
          {
            title: "Name",
            value: "Biggle Boo",
            type: "Text",
            fullTitle: "!T [All Info] Name",
            hidden: true,
          },
          {
            title: "Title",
            value: "The big moo moo",
            type: "Text",
            fullTitle: "!T [All Info] Title",
            hidden: true,
          },
          {
            title: "Office Phone",
            value: "888-999-0000 (Office)",
            type: "Text",
            fullTitle: "!T [All Info] Office Phone",
            hidden: true,
          },
          {
            title: "Cell Phone",
            value: "777-888-9999 (Cell)",
            type: "Text",
            fullTitle: "!T [All Info] Cell Phone",
            hidden: true,
          },
          {
            title: "Address",
            value: "123 Cool St, Peachtree City",
            type: "Text",
            fullTitle: "!T [All Info] Address",
            hidden: true,
          },
          {
            title: "Email",
            value: "biggle.boo@DeltaCommunityCU.com",
            type: "Text",
            fullTitle: "!T [All Info] Email",
            hidden: true,
          },
          {
            title: "NMLS#",
            value: "NMLS# 1234",
            type: "Text",
            fullTitle: "!T [All Info] NMLS#",
            hidden: false,
          },
          {
            title: "Third Section Bullet 2",
            value: "•\tOkie smokie   payment as low as 3%²",
            type: "Text",
            fullTitle: "!T Third Section Bullet 2",
            hidden: false,
          },
          {
            title: "Third Section Bullet 1",
            value: "•\tWait a sec¹",
            type: "Text",
            fullTitle: "!T Third Section Bullet 1",
            hidden: false,
          },
          {
            title: "Third Section Bullet 3",
            value: "•\tJumbo jumbo!",
            type: "Text",
            fullTitle: "!T Third Section Bullet 3",
            hidden: false,
          },
          {
            title: "Third Section Bullet 4",
            value: "•\t$Aye aye³",
            type: "Text",
            fullTitle: "!T Third Section Bullet 4",
            hidden: false,
          },
          {
            title: "Image",
            value: "Gary Massey.jpg",
            type: "Media",
            fullTitle: "!I Image",
            hidden: false,
          },
        ],
      },
    ] as InputTemplateValue[])
  );
};
