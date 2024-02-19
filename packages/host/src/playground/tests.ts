import type { TemplateMain } from "../classes/template/TemplateMain";

export const testIt = (template: TemplateMain) => {
  function setValuesFromList(list: string) {
    const parsed: InputTemplateValue[] = JSON.parse(list);
    template.setValuesFromList(parsed);
  }

  setValuesFromList(
    JSON.stringify([
      {
        id: "SzRWgvqIYbhnSdSTEJfIp",
        templateId: 10484,
        templateName: "Color BG Template",
        compName: "Big Ole Test",
        status: "Ready",
        fields: [
          { title: "CTA", value: "CONTACT US!", type: "Text", fullTitle: "!T [Company Info] CTA", hidden: true },
          {
            title: "Website",
            value: "adamthomashoward.com",
            type: "Text",
            fullTitle: "!T [Company Info] Website",
            hidden: true,
          },
          { title: "Phone", value: "123-000-000", type: "Text", fullTitle: "!T [Company Info] Phone", hidden: true },
          {
            title: "Single Address",
            value: "123 Street",
            type: "Text",
            fullTitle: "!T [Company Info] Single Address",
            hidden: true,
          },
          {
            title: "Multiple Address 1",
            value: "123 Street | Extra Phone",
            type: "Text",
            fullTitle: "!T [Company Info] Multiple Address 1",
            hidden: true,
          },
          {
            title: "Multiple Address 2",
            value: "123 Street | Phone 2",
            type: "Text",
            fullTitle: "!T [Company Info] Multiple Address 2",
            hidden: true,
          },
          {
            title: "Multiple Address 3",
            value: "123 Street | Phone 3",
            type: "Text",
            fullTitle: "!T [Company Info] Multiple Address 3",
            hidden: true,
          },
          {
            title: "Multiple Address 4",
            value: "123 Street | Phone 4",
            type: "Text",
            fullTitle: "!T [Company Info] Multiple Address 4",
            hidden: true,
          },
          {
            title: "Special Instructions",
            value: "Maecenas faucibus mollis interdum.",
            type: "Text",
            fullTitle: "!T [Company Info] Special Instructions",
            hidden: true,
          },
          {
            title: "Logo Text",
            value: "PERRETTA OVERHEAD",
            type: "Text",
            fullTitle: "!Tv [Company Info] Logo Text",
            hidden: false,
          },
          { title: "Logo", value: "Black Solid 1", type: "Media", fullTitle: "!Iv [Company Info] Logo", hidden: false },
          {
            title: "Primary Color",
            value: "#4E4E9EFF",
            type: "Color",
            fullTitle: "!C [Color] Color Control",
            hidden: false,
          },
          {
            title: "Secondary Color",
            value: "#B75F62FF",
            type: "Color",
            fullTitle: "!C [Color] Color Control",
            hidden: false,
          },
          {
            title: "Tertiary Color",
            value: "#4A3D4AFF",
            type: "Color",
            fullTitle: "!C [Color] Color Control",
            hidden: false,
          },
          {
            title: "Mostly White BG Color",
            value: "#CECECEFF",
            type: "Color",
            fullTitle: "!C [Color] Color Control",
            hidden: false,
          },
          {
            title: "Music Bed",
            value: "Binary Love - 30s.mp3",
            type: "Audio",
            fullTitle: "!A Music Bed",
            hidden: false,
          },
          {
            title: "Image 1 Text",
            value: "Walking the left",
            type: "Text",
            fullTitle: "!T [Slideshow] Image 1 Text",
            hidden: false,
          },
          {
            title: "Image 2 Text",
            value: "Walking to the right",
            type: "Text",
            fullTitle: "!T [Slideshow] Image 2 Text",
            hidden: false,
          },
          {
            title: "Image 3 Text",
            value: "Walking to the east",
            type: "Text",
            fullTitle: "!T [Slideshow] Image 3 Text",
            hidden: false,
          },
          {
            title: "Image 4 Text",
            value: "Walking all my life",
            type: "Text",
            fullTitle: "!T [Slideshow] Image 4 Text",
            hidden: false,
          },
          {
            title: "Image 1",
            value: "13640432_xxl.jpg",
            type: "Media",
            fullTitle: "!Ib [Slideshow] Image 1",
            hidden: false,
          },
          {
            title: "Image 2",
            value: "AdobeStock_109790437.jpeg",
            type: "Media",
            fullTitle: "!Ib [Slideshow] Image 2",
            hidden: false,
          },
          {
            title: "Image 3",
            value: "AdobeStock_208255477.jpeg",
            type: "Media",
            fullTitle: "!Ib [Slideshow] Image 3",
            hidden: false,
          },
          {
            title: "Image 4",
            value: "AdobeStock_103879472.jpeg",
            type: "Media",
            fullTitle: "!Ib [Slideshow] Image 4",
            hidden: false,
          },
        ],
      },
    ] as InputTemplateValue[])
  );
};
