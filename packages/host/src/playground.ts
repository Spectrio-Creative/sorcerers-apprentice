import { createSSNamespace } from "./main";
import { log } from "./tools/system";

const textData = [
  {
    id: "wiKkVQJCQtw9jsA7vDNuX",
    templateId: 120,
    templateName: "Fish",
    compName: "Fish",
    outputFile: "C:\\Users\\Prince John\\Creative Cloud Files\\Sorcerer's Script\\Fish.mp4",
    outputFormat: "H.264",
    outputPreset: "Match Source - High bitrate",
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
    status: "Ready",
    fields: [
      {
        title: "Text Color",
        value: "#415778FF",
        type: "Color",
        fullTitle: "!C [Options] Border Color",
        options: [],
        tab: "Options",
        hidden: false,
      },
      {
        title: "Second Color",
        value: "#A33636FF",
        type: "Color",
        fullTitle: "!C [Options] Border Color",
        options: [],
        tab: "Options",
        hidden: false,
      },
      {
        title: "Heading",
        value: "Montserrat-Black",
        type: "Font",
        fullTitle: "!F [Options] Heading",
        options: [],
        tab: "Options",
        hidden: true,
      },
      {
        title: "Second Background",
        value: "Moving Media",
        type: "Media",
        fullTitle: "!Ib [Overview] Second Background",
        options: ["background-size"],
        tab: "Overview",
        hidden: false,
      },
      {
        title: "First Background 2",
        value: "Moving Phase 1",
        type: "Media",
        fullTitle: "!I [Overview] First Background 2",
        options: [],
        tab: "Overview",
        hidden: false,
      },
      {
        title: "Weird Vid",
        value: "Moving Phase 2",
        type: "Media",
        fullTitle: "!Vf [Overview] Weird Vid",
        options: ["fill-size"],
        tab: "Overview",
        hidden: false,
      },
      {
        title: "Subtext 1",
        value: "Hey Now You're an Allstar",
        type: "Text",
        fullTitle: "!Tv [Overview] Subtext 1",
        options: ["visible"],
        tab: "Overview",
        hidden: false,
      },
      {
        title: "Subtext 2",
        value: "Hey Now You're a Rockstar",
        type: "Text",
        fullTitle: "!Tv [Overview] Subtext 2",
        options: ["visible"],
        tab: "Overview",
        hidden: false,
      },
      {
        title: "A Part Wheel of Fish",
        value: "Wow",
        type: "Text",
        fullTitle: "!T(Heading) [Overview] A Part Wheel of Fish",
        options: [],
        tab: "Overview",
        hidden: false,
      },
      {
        title: "A Whole Wheel of Fish",
        value: "Woah",
        type: "Text",
        fullTitle: "!T [Overview] A Whole Wheel of Fish",
        options: [],
        tab: "Overview",
        hidden: false,
      },
    ],
  },
  {
    id: "WvfLErrQhLWOsVEkAjUBm",
    templateId: 20383,
    templateName: "Media",
    compName: "Media",
    outputFile: "C:\\Users\\Prince John\\Creative Cloud Files\\Sorcerer's Script\\Media.mp4",
    outputFormat: "H.264",
    outputPreset: "Match Source - High bitrate",
    templateOverview: [
      {
        fullTitle: "!If [Phase 1] Bottom",
        title: "Bottom",
        headerTitle: "[Phase 1] Bottom",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 1] Top",
        title: "Top",
        headerTitle: "[Phase 1] Top",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 1] Left",
        title: "Left",
        headerTitle: "[Phase 1] Left",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 2] Bottom Right",
        title: "Bottom Right",
        headerTitle: "[Phase 2] Bottom Right",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 2] Top Right",
        title: "Top Right",
        headerTitle: "[Phase 2] Top Right",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 2] Middle",
        title: "Middle",
        headerTitle: "[Phase 2] Middle",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 2] Top Left",
        title: "Top Left",
        headerTitle: "[Phase 2] Top Left",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 2] Bottom Left",
        title: "Bottom Left",
        headerTitle: "[Phase 2] Bottom Left",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
    ],
    status: "Disabled",
    fields: [],
  },
  {
    id: "8WV0SrK8guAcO3tktLyic",
    templateId: 23286,
    templateName: "Moving Media",
    compName: "Moving Media",
    outputFile: "C:\\Users\\Prince John\\Creative Cloud Files\\Sorcerer's Script\\Moving Media.mp4",
    outputFormat: "H.264",
    outputPreset: "Match Source - High bitrate",
    templateOverview: [
      {
        fullTitle: "!If [Phase 1] Bottom",
        title: "Bottom",
        headerTitle: "[Phase 1] Bottom",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 1] Top",
        title: "Top",
        headerTitle: "[Phase 1] Top",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 1] Left",
        title: "Left",
        headerTitle: "[Phase 1] Left",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 2] Bottom Right",
        title: "Bottom Right",
        headerTitle: "[Phase 2] Bottom Right",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 2] Top Right",
        title: "Top Right",
        headerTitle: "[Phase 2] Top Right",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 2] Middle",
        title: "Middle",
        headerTitle: "[Phase 2] Middle",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 2] Top Left",
        title: "Top Left",
        headerTitle: "[Phase 2] Top Left",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
      {
        fullTitle: "!If [Phase 2] Bottom Left",
        title: "Bottom Left",
        headerTitle: "[Phase 2] Bottom Left",
        defaultValue: "Pale Gray-Blue Solid 1",
      },
    ],
    status: "Disabled",
    fields: [],
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
// const response = ss.setValuesFromList(JSON.stringify(textData));

log(ss.getMenuInfo());

// log(ss.fetchAMEFormatsData());

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
