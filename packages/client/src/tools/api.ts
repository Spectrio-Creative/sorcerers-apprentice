import { decimalToRgb, formatAsDecimal } from "../../../shared/tools/color";
import * as fs from "./fs";
import type CSInterface from "../../types/CSInterface";

// @ts-ignore
import tinycolor from "tinycolor2";
import { sorcererStore } from "../stores/sorcerer";
import { inputsStore } from "../stores/inputs";

//@ts-ignore
export const csInterface: CSInterface = new CSInterface();

export const isDev = import.meta.env.DEV;

export function convertDefaultColorsToHex(overview: SorcererOverview): SorcererOverview {
  const newOverview = { ...overview };
  newOverview.templates.forEach((template) => {
    template.fields.forEach((field) => {
      if (field.type === "Color") {
        const newColor = decimalToRgb(formatAsDecimal(field.value), true);
        field.value = tinycolor(newColor).toHexString();
      }
    });
  });
  return newOverview;
}

export function aeAlert(message: string) {
  if (isDev) {
    console.warn(message);
    return;
  }
  csInterface.evalScript(`alert("${message}")`);
}

export function aeQuestion(message: string): Promise<boolean> {
  return new Promise((resolve, _reject) => {
    if (isDev) {
      const response = confirm(message);
      response ? console.log(message, response) : console.warn(message, response);
      resolve(response);
      return;
    }
    csInterface.evalScript(`confirm("${message}")`, (res) => {
      resolve(res === "true");
    });
  });
}

// export function saveFile(data: string, fileName: string, type: string) {
//   if (isDev) {
//     const blob = new Blob([data], { type });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = fileName;
//     a.click();
//     return;
//   }

//   csInterface.evalScript(`
//   var data = ${JSON.stringify(data)};
//   var fileName = ${JSON.stringify(fileName)};
//   var type = ${JSON.stringify(type)};
//   saveFile(data, fileName, type);`);
// }

export function getProjectPath(): Promise<string> {
  return new Promise((resolve, _reject) => {
    csInterface.evalScript(
      `
    function appPath() {
      var project = app.project;
      if (!project) return "No Project Open";
      if (project.file === null) {
        return "Unsaved";
      }
      return app.project.file.absoluteURI;
    }
    ss.appPath();
    `,
      (res) => {
        resolve(res as string);
      }
    );
  });
}

export async function fetchAMEFormatsData(): Promise<AMEFormatsObj> {
  if (isDev) {
    // return { timestamp: `${new Date()}`, formats: {} };
    const demoData: AMEFormatsObj = await (await fetch("../dev/AMEPresets.json")).json();
    return demoData;
  }

  return new Promise((resolve, _reject) => {
    csInterface.evalScript("ss.fetchAMEFormatsData();", async (res) => {
      // console.log(res);
      if (res === "{}" || res === "") {
        resolve({ timestamp: `${new Date()}`, formats: {} });
      }
      const data = JSON.parse(res as string);

      console.log(data);

      resolve(data || { timestamp: `${new Date()}`, formats: {} });
    });
  });
}

export async function refreshAMEFormatsData(): Promise<AMEFormatsObj> {
  if (isDev) {
    const demoData: AMEFormatsObj = await (await fetch("../dev/AMEPresets.json")).json();
    return demoData;
  }

  const timestamp = new Date();

  const checkTimeAndWait: () => Promise<AMEFormatsObj> = async () => {
    const data = await fetchAMEFormatsData();

    const lastRefresh = new Date(data.timestamp);
    if (timestamp < lastRefresh) {
      return data;
    }

    return new Promise((resolve, _reject) => {
      setTimeout(async () => {
        resolve(await checkTimeAndWait());
      }, 1000);
    });
  };

  return new Promise(async (resolve, _reject) => {
    csInterface.evalScript("ss.refreshAMEFormatsData();");
    resolve(await checkTimeAndWait());
  });
}

export async function fetchSorcererData(quiet = true): Promise<SorcererOverview> {
  const sorcerer = sorcererStore();
  const inputs = inputsStore();

  if (isDev) {
    const demoData: SorcererOverview = await (await fetch("../dev/MenuInfo.json")).json();
    return convertDefaultColorsToHex(demoData);
  }

  const currentPath = await getProjectPath();

  if (currentPath === "No Project Open") {
    return {
      templates: [],
      fonts: [],
      libraryAssets: [],
    } as SorcererOverview;
  }

  if (currentPath !== sorcerer.projectPath) {
    sorcerer.projectPath = currentPath;
    inputs.clear();
  }

  return new Promise((resolve, _reject) => {
    csInterface.evalScript("ss.getMenuInfo();", (res) => {
      if (res === "") {
        if (!quiet) csInterface.evalScript("alert('Error:\\nNo template data found in open project.')");
        resolve({
          templates: [],
          fonts: [],
          libraryAssets: [],
        } as SorcererOverview);
      }
      const data = convertDefaultColorsToHex(JSON.parse(res as string));

      resolve(data);
    });
  });
}

export async function sendSorcererData(data: InputTemplateValue[]): Promise<CompResponse> {
  return new Promise((resolve, _reject) => {
    if (isDev) {
      // Settimeout to simulate the delay of the host
      setTimeout(() => {
        console.log(JSON.parse(JSON.stringify(data)));
        // console.log(`setValuesFromList('${JSON.stringify(data)}');`);
        resolve({
          status: "OK",
          compIds: data.map((_d) => ({ id: "123", guid: "456" })),
        });
      }, 1000);
      return;
    }

    csInterface.evalScript(
      `
    var jsonString = ${JSON.stringify(JSON.stringify(data))};
    ss.setValuesFromList(jsonString);
    `,
      (res) => {
        console.log(res);
        resolve(JSON.parse(res as string || JSON.stringify({status: "ERROR", error: "Didn't get response from AE Call"} as CompResponseERROR)) as CompResponse);
      }
    );
  });
}

export async function sendCompsToAME(data: AMEComp[], startRender = false): Promise<AMEResponse> {
  if (isDev) {
    console.log(data);
    return {
      status: "OK",
    };
  }

  return new Promise((resolve, _reject) => {
    csInterface.evalScript(
      `
    var data = ${JSON.stringify(data)};
    var startRender = ${JSON.stringify(startRender)};
    ss.sendCompsToAME(data, startRender);
    `,
      (res) => {
        console.log(res);
        resolve(JSON.parse(res as string));
      }
    );
  });
}

export async function runTest(): Promise<string> {
  return new Promise((resolve, _reject) => {
    if (isDev) {
      // Settimeout to simulate the delay of the host
      setTimeout(() => {
        resolve("OK");
      }, 1000);
      return;
    }

    csInterface.evalScript("testIt();", (res) => {
      console.log(res);
      resolve(res as string);
    });
  });
}

export async function sayHello(): Promise<string> {
  return new Promise((resolve, _reject) => {
    if (isDev) {
      alert("Running SayHello function from host");
      return;
    }

    csInterface.evalScript("ss.SayHello();", (res) => {
      console.log(res);
      resolve(res as string);
    });
  });
}

export async function selectFile(type: SorcererFile = "other"): Promise<{
  status: string;
  file: string;
  filePath: string;
  fileName: string;
}> {
  if (isDev) {
    const fileInfo = await fs.selectFile(type);
    console.log("selected file", fileInfo);
    return fileInfo;
  }

  return new Promise((resolve, _reject) => {
    csInterface.evalScript(
      `
    var type = ${JSON.stringify(type)};
    ss.selectFile(type);`,
      (res) => {
        console.log(res);
        resolve(JSON.parse(res as string));
      }
    );
  });
}

export async function saveFile({
  data,
  fileName,
  type,
}: {
  data?: string;
  fileName?: string;
  type?: SorcererFile;
}): Promise<FileResponse> {
  fileName = fileName || "Untitled";
  type = type || "other";

  if (isDev) {
    const fileInfo = await fs.saveFile(data, type);
    console.log("saved file", fileInfo);
    return fileInfo;
  }

  return new Promise((resolve, _reject) => {
    csInterface.evalScript(
      `
    var data = ${JSON.stringify(data)};
    var fileName = ${JSON.stringify(fileName)};
    var type = ${JSON.stringify(type)};
    ss.saveFile(data, type);`,
      (res) => {
        console.log(res);
        resolve(JSON.parse(res as string));
      }
    );
  });
}
