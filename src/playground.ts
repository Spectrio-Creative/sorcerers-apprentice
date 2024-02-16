// // import { formatAsDecimal } from "./tools/color";
// // import polyfill from "./tools/polyfill";
// // polyfill();

// // alert(`${formatAsDecimal("0.5, 0.5, 0.5, 0.5")}`);

// // const montserrat = app.fonts.getFontsByPostScriptName("Montserrat");
// // const montserratLite = app.fonts.getFontsByPostScriptName("Montserrat-Thin");
// // const montserratSemiBold = app.fonts.getFontsByPostScriptName("Montserrat-SemiBold");
// // alert(JSON.stringify(montserrat));
// // alert(JSON.stringify(montserratLite));
// // alert(JSON.stringify(montserratSemiBold));
// // // alert(JSON.stringify(app.fonts.allFonts[0]));

// // let firstFont;

// // // Find the first text layer
// // for (let i = 1; i <= app.project.items.length; i++) {
// //   const item = app.project.items[i];
// //   if (item instanceof CompItem) {
// //     for (let ii = 1; ii <= item.layers.length; ii++) {
// //       const layer = item.layers[ii];

// //       if (!firstFont) {
// //         firstFont = {
// //           font: (layer as TextLayer).text.sourceText.value.font,
// //           fontFamily: (layer as TextLayer).text.sourceText.value.fontFamily,
// //           fontStyle: (layer as TextLayer).text.sourceText.value.fontStyle,
// //         };
// //       }
// //     }
// //   }
// // }
// // // const textLayer = app.project.activeItem.layers.find((layer) => layer instanceof TextLayer);
// // // const textLayer = app.activeDocument.layers.find((layer) => layer.type === "TextLayer");

// // alert(JSON.stringify(firstFont));

// interface Font {
//   font: string;
//   fontFamily: string;
//   fontStyle: string;
// }

// const projectFonts: Font[] = [];

// // Find the first text layer
// for (let i = 1; i <= app.project.items.length; i++) {
//   const item = app.project.items[i];
//   if (item instanceof CompItem) {
//     for (let ii = 1; ii <= item.layers.length; ii++) {
//       const layer = item.layers[ii];

//       if (!(layer instanceof TextLayer)) continue;

//       const font: Font = {
//         font: (layer as TextLayer).text.sourceText.value.font,
//         fontFamily: (layer as TextLayer).text.sourceText.value.fontFamily,
//         fontStyle: (layer as TextLayer).text.sourceText.value.fontStyle,
//       };

//       //   If the font is not already in the projectFonts array, add it.
//       if (!projectFonts.some((projectFont) => projectFont.font === font.font)) {
//         projectFonts.push(font);
//       }
//     }
//   }
// }

// alert(JSON.stringify(projectFonts));

let color = "1, , 1)";
alert("Step 1");
const matchRGB = (str: string) => new RegExp(`(?:${str} *, *){2,3} *(?:${str} *)`);
const eightBit = matchRGB("(?:[0-9]{1,3})");
// const decimalMatch = matchRGB("(?:(?:[01]?\\.[0-9]+)|(?:[01]))");
const decimalMatch = matchRGB("(?:[01]?(?:\\.[0-9]+)?)");

alert("Step 2");

color = color.replace(/ /g, "");
alert(`Step 2.5: ${color}`);
alert(`Step 2.6: ${/^#/.test(color)}`);
alert(`Step 2.8: ${eightBit.test(color)}`);
alert(`Step 2.7: ${decimalMatch.test(color)}`);