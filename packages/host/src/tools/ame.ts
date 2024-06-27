interface AMEQueueOptions {
  start: boolean;
  log: string;
  output: string;
  errors: string;
  format: string;
  preset: string;
}

export function queueCompsInAME(comps: CompItem[], options?: AMEQueueOptions) {
  const projectPath = app.project.file.fsName;
  const format = options?.format || "H.264";
  const preset = options?.preset || "Match Source - High bitrate";
  let ameScript = "var frontend = app.getFrontend();\nvar encoderHost = app.getEncoderHost();\n";
  ameScript += `function addLinkComp(guid, title) {
  var item = frontend.addDLToBatch(
    "${projectPath.replace(/\\/g, "\\\\")}",
    "${format}",
    "${preset}",
    guid
  );
  var success = item !== null;
  if (!success) {
    alert("Item could not be added to batch: " + title);
  }
}
\n`;

  for (const comp of comps) {
    ameScript += `addLinkComp("${(comp as any).dynamicLinkGUID}", "${comp.name}");\n`;
  }

  if (options?.start) ameScript += "encoderHost.runBatch();\n";

  const ameIsOpen = BridgeTalk.isRunning("ame");
  
  const bt = new BridgeTalk();

  bt.target = "ame";
  bt.body = ameScript;

  bt.onResult = function (res) {
    let result = res.body;
    if (!res.body) {
      result = options?.start ? "Batch started." : "Items added to batch.";
    }

    alert(result);
  };

  bt.onError = function (err) {
    let errorBody = err.body;
    if (!err.body) {
      errorBody = "No response from AME.";
    }

    if (!ameIsOpen) {
      errorBody += "\nTry opening Adobe Media Encoder first.";
    }

    alert(errorBody);
  };

  bt.send();
}


export function queueInAME(comps: AMEComp[], startQueue = false) {
  const projectPath = app.project.file.fsName;
  let ameScript = "var frontend = app.getFrontend();\nvar encoderHost = app.getEncoderHost();\n";
  ameScript += `function addLinkComp(format, preset, guid, output) {
  var item = frontend.addDLToBatch(
    "${projectPath.replace(/\\/g, "\\\\")}",
    format,
    preset,
    guid,
    output
  );
  var success = item !== null;
  if (!success) {
    alert("Item could not be added to batch: " + output);
  }
}
\n`;

  for (const comp of comps) {
    ameScript += `addLinkComp("${comp.format}", "${comp.preset}", "${comp.guid}", "${comp.filePath}");\n`;
  }

  if (startQueue) ameScript += "encoderHost.runBatch();\n";

  const ameIsOpen = BridgeTalk.isRunning("ame");
  
  const bt = new BridgeTalk();

  bt.target = "ame";
  bt.body = ameScript;

  bt.onResult = function (res) {
    let result = res.body;
    if (!res.body) {
      result = startQueue ? "Batch started." : "Items added to batch.";
    }
  };

  bt.onError = function (err) {
    let errorBody = err.body;
    if (!err.body) {
      errorBody = "No response from AME.";
    }

    if (!ameIsOpen) {
      errorBody += "\nTry opening Adobe Media Encoder first.";
    }

    alert(errorBody);
  };

  bt.send();
}