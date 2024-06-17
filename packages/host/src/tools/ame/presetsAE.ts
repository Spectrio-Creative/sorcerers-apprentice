export function savePresetsJSON({
  callback,
  jsonLocation,
}: {
  callback: (filePath: string) => void;
  jsonLocation: File | string;
}) {
  const jsonFileString = typeof jsonLocation === "string" ? jsonLocation : jsonLocation.fsName;
  let ameScript = `{{AME_SCRIPT}}`;
    
  ameScript += `\n\nwritePresetsJSON("${jsonFileString}");`;

  const ameIsOpen = BridgeTalk.isRunning("ame");

  const bt = new BridgeTalk();
  bt.target = "ame";
  bt.body = ameScript;

  bt.onResult = function (res) {
    let result = res.body;
    callback(result);
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
