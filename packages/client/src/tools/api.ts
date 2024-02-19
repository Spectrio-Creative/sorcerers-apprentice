import { decimalToRgb, formatAsDecimal } from "../../../shared/tools/color";

// @ts-ignore
import tinycolor from "tinycolor2";
import { sorcererStore } from "../stores/sorcerer";
import { inputsStore } from "../stores/inputs";

//@ts-ignore
export const csInterface = new CSInterface();

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
    appPath();
    `,
      (res: string) => {
        resolve(res);
      }
    );
  });
}

export async function fetchSorcererData(): Promise<SorcererOverview> {
  const sorcerer = sorcererStore();
  const inputs = inputsStore();

  if (isDev) {
    const demoData: SorcererOverview = await (await fetch("../.cache/MenuInfo.json")).json();
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
    csInterface.evalScript("getMenuInfo();", (res: string) => {
      if (res === "") {
        resolve({
          templates: [],
          fonts: [],
          libraryAssets: [],
        } as SorcererOverview);
      }
      const data = convertDefaultColorsToHex(JSON.parse(res));

      resolve(data);
    });
  });
}

export async function sendSorcererData(data: InputTemplateValue[]) {
  return new Promise((resolve, _reject) => {
    if (isDev) {
      // Settimeout to simulate the delay of the host
      setTimeout(() => {
        resolve("OK");
      }, 1000);
      return;
    }

    csInterface.evalScript(`setValuesFromList('${JSON.stringify(data)}');`, (res: string) => {
      console.log(res);
      resolve(res);
    });
  });
}
