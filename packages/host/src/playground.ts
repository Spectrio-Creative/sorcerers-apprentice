import { createSSNamespace } from "./main";
import { log } from "./tools/system";

const textData = [
  {
    id: "62NXaX82_I1viRJu5cfaG",
    templateId: 120,
    templateName: "Fish",
    compName: "All Fish Captain",
    outputFile: "C:\\Users\\Prince John\\Creative Cloud Files\\Sorcerer's Script\\AllFishCaptain.mp4",
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
  {
    id: "62NXaX82_I1viRJu5cfaF",
    templateId: 120,
    templateName: "Fish",
    compName: "All Fish Skipper",
    outputFile: "C:\\Users\\Prince John\\Creative Cloud Files\\Sorcerer's Script\\AllFishSkipper.mp4",
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
        value: "mountain1.jpg",
        type: "Media",
        fullTitle: "!Ib [Overview] Second Background",
        options: ["background-size"],
        tab: "Overview",
        hidden: false,
      },
      {
        title: "First Background 2",
        value: "mountain2.jpg",
        type: "Media",
        fullTitle: "!I [Overview] First Background 2",
        options: [],
        tab: "Overview",
        hidden: false,
      },
      {
        title: "Weird Vid",
        value: "mountain4.jpg",
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
  {
    id: "y1GvUZe6uNBgrIJWqi2Gk",
    templateId: 23286,
    templateName: "Moving Media",
    compName: "Moving Media Man",
    outputFile: "~/Media.mp4",
    templateOverview: [
      {
        fullTitle: "!I [Phase 1] Bottom",
        title: "Bottom",
        headerTitle: "[Phase 1] Bottom",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!I [Phase 1] Top",
        title: "Top",
        headerTitle: "[Phase 1] Top",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!I [Phase 1] Left",
        title: "Left",
        headerTitle: "[Phase 1] Left",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!I [Phase 2] Bottom Right",
        title: "Bottom Right",
        headerTitle: "[Phase 1] Bottom Right",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!I [Phase 2] Top Right",
        title: "Top Right",
        headerTitle: "[Phase 1] Top Right",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!I [Phase 2] Middle",
        title: "Middle",
        headerTitle: "[Phase 1] Middle",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!I [Phase 2] Top left",
        title: "Top Left",
        headerTitle: "[Phase 1] Top Left",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!I [Phase 2] Bottom left",
        title: "Bottom Left",
        headerTitle: "[Phase 1] Bottom Left",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
    ],
    status: "Ready",
    fields: [
      {
        title: "Bottom",
        value: "mountain1.jpg",
        type: "Media",
        fullTitle: "!I [Phase 1] Bottom",
        options: [],
        tab: "Phase 1",
        hidden: false,
      },
      {
        title: "Top",
        value: "mountain2.jpg",
        type: "Media",
        fullTitle: "!I [Phase 1] Top",
        options: [],
        tab: "Phase 1",
        hidden: false,
      },
      {
        title: "Left",
        value: "mountain3.jpg",
        type: "Media",
        fullTitle: "!I [Phase 1] Left",
        options: [],
        tab: "Phase 1",
        hidden: false,
      },
      {
        title: "Bottom Right",
        value: "mountain4.jpg",
        type: "Media",
        fullTitle: "!I [Phase 2] Bottom Right",
        options: [],
        tab: "Phase 1",
        hidden: false,
      },
      {
        title: "Top Right",
        value: "beach1.jpg",
        type: "Media",
        fullTitle: "!I [Phase 2] Top Right",
        options: [],
        tab: "Phase 1",
        hidden: false,
      },
      {
        title: "Middle",
        value: "beach2.jpg",
        type: "Media",
        fullTitle: "!I [Phase 2] Middle",
        options: [],
        tab: "Phase 1",
        hidden: false,
      },
      {
        title: "Top Left",
        value: "peace_on_earth.png",
        type: "Media",
        fullTitle: "!I [Phase 2] Top left",
        options: [],
        tab: "Phase 1",
        hidden: false,
      },
      {
        title: "Bottom Left",
        value: "poodle.png",
        type: "Media",
        fullTitle: "!I [Phase 2] Bottom left",
        options: [],
        tab: "Phase 1",
        hidden: false,
      },
    ],
    outputFormat: "H.264",
    outputPreset: "Match Source - High bitrate",
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

// const responseObj = JSON.parse(response) as CompResponseOK;

// const ameComps: AMEComp[] = [];

// const guid = responseObj.compIds[0]?.guid;

// const input = textData[0];

// if (guid) {
//   ameComps.push({
//     guid,
//     filePath: input.outputFile as string,
//     format: input.outputFormat as string,
//     preset: input.outputPreset as string,
//   });
// }

// log(JSON.stringify(ameComps));

// ss.sendCompsToAME(ameComps, false);