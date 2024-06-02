export function getAMELocation() {
  if (system.osName === "MacOS") {
    return getAMELocationMac();
  } else if (system.osName === "Windows") {
    return getAMELocationWin();
  } else {
    return null;
  }
}

function getAMELocationMac() {
  const cmd = 'mdfind "kind:application" -name Adobe Media Encoder';
  //   const cmd = "mdfind \"kMDItemCFBundleIdentifier == 'com.adobe.ame.application'\"";
  const result = system.callSystem(cmd);
  if (result) {
    const paths = result.split("\n");
    // First result ending in ".app" is usually the correct path
    for (const path of paths) {
      if (/\.app$/.test(path)) {
        const version = path.match(/Adobe Media Encoder (\d+)/);
        return path + "/Contents/MacOS/Adobe Media Encoder " + version[1];
      }
    }
    return null;
    //     const path = result.split("\n")[0]; // First result is usually the correct path
    //     return path + "/Contents/MacOS/Adobe Media Encoder";
  } else {
    return null;
  }
}

function getAMELocationWin() {
  const cmd = 'where "Adobe Media Encoder.exe"';
  const result = system.callSystem(cmd);
  if (result) {
    return result.split("\r\n")[0]; // First result is usually the correct path
  } else {
    return null;
  }
}

interface AMEQueueOptions {
  start: boolean;
  log: string;
  output: string;
  errors: string;
  format: string;
  preset: string;
}

export function queueInAME(comps: CompItem[], options?: AMEQueueOptions) {
  const projectPath = app.project.file.fsName;
  const format = options?.format || "H.264";
  const preset = options?.preset || "Match Source - High bitrate";
  let ameScript = "var frontend = app.getFrontend();";
  ameScript += `function addLinkComp(guid, title) {
    var item = frontend.addDLToBatch(
      "${projectPath}",
      "${format}",
      "${preset}",
      guid
    );
    var success = item !== null;
    if (!success) {
      alert("Item could not be added to batch: " + title);
    }
  }
  `;

  for (const comp of comps) {
    ameScript += `addLinkComp("${(comp as any).dynamicLinkGUID}", "${comp.name}");\n`;
  }

  if(options?.start) ameScript += "frontend.startBatch();\n";

  ameScript += "app.exit();";

  const ameScriptFile = new File("~/ame_batch.jsx");
  ameScriptFile.open("w");
  ameScriptFile.write(ameScript);
  ameScriptFile.close();

  const baseCmd = `"${getAMELocation()}" --console es.processFile "${ameScriptFile.fsName}"`;
  // const cmd = `${baseCmd} --log "${options.log}" --output "${options.output}" --errors "${options.errors}"`;

  alert(baseCmd);

  const result = system.callSystem(baseCmd);

  alert(result);

  // ameScriptFile.remove();
}
