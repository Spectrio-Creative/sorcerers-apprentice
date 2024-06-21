import { createSSNamespace } from "./main";
import { log } from "./tools/system";

const textData = [
  {
    id: "62NXaX82_I1viRJu5cfaG",
    templateId: 120,
    templateName: "Fish",
    compName: "All Fish",
    outputFile: "C:\\Users\\Prince John\\Creative Cloud Files\\Sorcerer's Script\\Fish.mp4",
    templateOverview: [
      {
        fullTitle: "!F [Options] Heading",
        title: "Heading",
        headerTitle: "[Options] Heading",
        defaultValue: "Montserrat-Medium",
      },
      {
        fullTitle: "!Ib [Overview] Second Background",
        title: "Second Background",
        headerTitle: "[Overview] Second Background",
        defaultValue: "DarkGrey",
      },
      {
        fullTitle: "!I [Overview] First Background 2",
        title: "First Background 2",
        headerTitle: "[Overview] First Background 2",
        defaultValue: "DarkGrey",
      },
      {
        fullTitle: "!C [Options] Border Color",
        title: "Text Color",
        headerTitle: "[Options] Text Color",
        defaultValue: "#4736a3",
      },
      {
        fullTitle: "!C [Options] Border Color",
        title: "Second Color",
        headerTitle: "[Options] Second Color",
        defaultValue: "#a35a36",
      },
      {
        fullTitle: "!T(Heading) [Overview] A Part Wheel of Fish",
        title: "A Part Wheel of Fish",
        headerTitle: "[Overview] A Part Wheel of Fish",
        defaultValue: "A Whole Wheel of Fish",
      },
      {
        fullTitle: "!Tv [Overview] Subtext 1",
        title: "Subtext 1",
        headerTitle: "[Overview] Subtext 1",
        defaultValue: "[x] Subtext",
      },
      {
        fullTitle: "!Vf [Overview] Weird Vid",
        title: "Weird Vid",
        headerTitle: "[Overview] Weird Vid",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!T [Overview] A Whole Wheel of Fish",
        title: "A Whole Wheel of Fish",
        headerTitle: "[Overview] A Whole Wheel of Fish",
        defaultValue: "A Whole Wheel of Fish",
      },
      {
        fullTitle: "!Tv [Overview] Subtext 2",
        title: "Subtext 2",
        headerTitle: "[Overview] Subtext 2",
        defaultValue: "[x] Subtext",
      },
    ],
    status: "Complete",
    fields: [
      {
        title: "Second Background",
        value: "C:\\Users\\Prince John\\Creative Cloud Files\\Sorcerer's Script\\movement_demo.mp4",
        type: "Media",
        fullTitle: "!Ib [Overview] Second Background",
        options: ["background-size"],
        tab: "Overview",
        hidden: false,
      },
      {
        title: "First Background 2",
        value: "C:\\Users\\Prince John\\Creative Cloud Files\\Sorcerer's Script\\movement_demo_1.mp4",
        type: "Media",
        fullTitle: "!I [Overview] First Background 2",
        options: [],
        tab: "Overview",
        hidden: false,
      },
      {
        title: "Weird Vid",
        value: "C:\\Users\\Prince John\\Creative Cloud Files\\Sorcerer's Script\\movement_demo_2.mp4",
        type: "Media",
        fullTitle: "!Vf [Overview] Weird Vid",
        options: ["fill-size"],
        tab: "Overview",
        hidden: false,
      },
      {
        title: "Subtext 1",
        value: "Subtext",
        type: "Text",
        fullTitle: "!Tv [Overview] Subtext 1",
        options: ["visible"],
        tab: "Overview",
        hidden: true,
      },
      {
        title: "Subtext 2",
        value: "Subtext",
        type: "Text",
        fullTitle: "!Tv [Overview] Subtext 2",
        options: ["visible"],
        tab: "Overview",
        hidden: true,
      },
      {
        title: "A Part Wheel of Fish",
        value: "A Part Wheel of Fish",
        type: "Text",
        fullTitle: "!T(Heading) [Overview] A Part Wheel of Fish",
        options: [],
        tab: "Overview",
        hidden: false,
      },
      {
        title: "A Whole Wheel of Fish",
        value: "A Whole Wheel of Fishes",
        type: "Text",
        fullTitle: "!T [Overview] A Whole Wheel of Fish",
        options: [],
        tab: "Overview",
        hidden: false,
      },
    ],
    outputFormat: "H.264",
    outputPreset: "Match Source - Adaptive High Bitrate",
  },
];

// const scriptFile = new File($.fileName);
// const scriptPath = new File($.fileName).fsName;

// alert(`Script file info:\
//     absoluteURI: ${scriptFile.absoluteURI}
//     getRelativeURI('/'): ${scriptFile.getRelativeURI('/')}
//     fsName: ${scriptFile.fsName}
//     name: ${scriptFile.name}
//     displayName: ${scriptFile.displayName}
//     Script path: ${scriptPath}`)

log("Running playground");

const ss = createSSNamespace();
const response = ss.setValuesFromList(JSON.stringify(textData));

log(response);

const responseObj = JSON.parse(response) as CompResponseOK;

const ameComps: AMEComp[] = [];

const guid = responseObj.compIds[0]?.guid;

const input = textData[0];

if (guid) {
  ameComps.push({
    guid,
    filePath: input.outputFile as string,
    format: input.outputFormat as string,
    preset: input.outputPreset as string,
  });
}

log(JSON.stringify(ameComps));

// app.project.save();

// const ameComps = [
//   {
//     guid: "00004927-0000-0000-0000-000000000000",
//     filePath: "C:\\Users\\Prince John\\Creative Cloud Files\\Sorcerer's Script\\Fish.mp4",
//     format: "H.264",
//     preset: "Match Source - Adaptive High Bitrate",
//   },
// ];

ss.sendCompsToAME(ameComps, false);
