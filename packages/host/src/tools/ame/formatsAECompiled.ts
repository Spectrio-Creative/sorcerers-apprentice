export function saveFormatsJSON({
  callback,
  jsonLocation,
}: {
  callback: (filePath: string) => void;
  jsonLocation: File | string;
}) {
  const jsonFileString = typeof jsonLocation === "string" ? jsonLocation : jsonLocation.fsName;
  let ameScript = `
function createBMP(width, height, color) {
  var headerSize = 54;
  var fileSize = headerSize + width * height * 3;
  var buffer = [];
  
  buffer.push(0x42); 
  buffer.push(0x4d); 
  buffer.push(fileSize & 0xff);
  buffer.push(fileSize >> 8 & 0xff);
  buffer.push(fileSize >> 16 & 0xff);
  buffer.push(fileSize >> 24 & 0xff);
  buffer.push(0);
  buffer.push(0); 
  buffer.push(0);
  buffer.push(0); 
  buffer.push(headerSize);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); 
  
  buffer.push(40);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); 
  buffer.push(width & 0xff);
  buffer.push(width >> 8 & 0xff);
  buffer.push(width >> 16 & 0xff);
  buffer.push(width >> 24 & 0xff);
  buffer.push(height & 0xff);
  buffer.push(height >> 8 & 0xff);
  buffer.push(height >> 16 & 0xff);
  buffer.push(height >> 24 & 0xff);
  buffer.push(1);
  buffer.push(0); 
  buffer.push(24);
  buffer.push(0); 
  buffer.push(0);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); 
  buffer.push(width * height * 3 & 0xff);
  buffer.push(width * height * 3 >> 8 & 0xff);
  buffer.push(width * height * 3 >> 16 & 0xff);
  buffer.push(width * height * 3 >> 24 & 0xff);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); 
  buffer.push(0);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); 
  buffer.push(0);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); 
  buffer.push(0);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); 
  
  var colorB = color[2];
  var colorG = color[1];
  var colorR = color[0];
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      buffer.push(colorB);
      buffer.push(colorG);
      buffer.push(colorR);
    }
  }
  return buffer;
}
function writeBMPFile(filePath, width, height, color) {
  var bmpBuffer = createBMP(width, height, color);
  var file = new File(filePath);
  file.encoding = "binary";
  file.open("w");
  for (var i = 0; i < bmpBuffer.length; i++) {
    file.write(String.fromCharCode(bmpBuffer[i]));
  }
  file.close();
}

function writeFormatsJSON(jsonLocation) {
  if (jsonLocation === void 0) {
    jsonLocation = "~/formats.json";
  }
  var jsonFile = typeof jsonLocation === "string" ? new File(jsonLocation) : jsonLocation;
  
  var encoder = app.getEncoderHost();
  var formats = encoder.getFormatList();
  
  
  var frontend = app.getFrontend();
  
  var filePath = "~/red.bmp";
  var width = 16;
  var height = 9;
  var color = [255, 0, 0]; 
  var file = new File(filePath);
  if (!file.exists) {
    writeBMPFile(filePath, width, height, color);
  }
  var encoderWrapper = frontend.addFileToBatch(file.fsName, "H.264", "Match Source - High bitrate");
  var formatJSON = {};
  
  for (var _i = 0, formats_1 = formats; _i < formats_1.length; _i++) {
    var format = formats_1[_i];
    
    encoderWrapper.loadFormat(format);
    var presets = [];
    var list = encoderWrapper.getPresetList();
    for (var _a = 0, list_1 = list; _a < list_1.length; _a++) {
      var preset = list_1[_a];
      var breakPoint = preset.indexOf("#");
      var presetName = preset.substring(breakPoint + 1);
      presets.push(presetName);
    }
    formatJSON[format] = presets;
  }
  
  
  var exporter = app.getExporter();
  exporter.removeAllBatchItems();
  file.remove();
  var simpleStringify = function simpleStringify(obj) {
    var str = "{";
    for (var key in obj) {
      str += '"' + key + '": [ ';
      for (var _i = 0, _a = obj[key]; _i < _a.length; _i++) {
        var item = _a[_i];
        str += '"' + item + '",';
      }
      
      str = str.slice(0, -1);
      str += " ],";
    }
    
    str = str.slice(0, -1);
    str += "}";
    return str;
  };
  
  jsonFile.open("w");
  jsonFile.write('{ "timestamp": "' + new Date() + '", "formats": ' + simpleStringify(formatJSON) + "}");
  jsonFile.close();
  return jsonFile.fsName;
}



`;
    
  ameScript += `\n\nwriteFormatsJSON("${jsonFileString}");`;

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
