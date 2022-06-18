import { convertObj } from "./convertObj";

function clean(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== "" && arr[i] !== null && arr[i] !== undefined) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

const getSpreadsheet = (inputFile) => {
  let outObj;
  if (inputFile != null) {
    try {
      // open file
      const fileOK = inputFile.open("r");
      // const thisFile = inputFile;
      let fileObj = [],
        fileObj2 = "";
      if (fileOK) {
        let text;
        while (!inputFile.eof) {
          text = inputFile.readln();
          fileObj2 += text + "\\n";
        }
  
        fileObj = fileObj2
          .slice(0, -2)
          .replace(/,(?!(?:[^"]|"[^"]*")*$)/g, "\\;")
          .replace(/\\n(?!(?:[^"]|"[^"]*")*$)/g, "\\m")
          .split(/\\n/g);
  
        outObj = convertObj(fileObj);
  
        inputFile.close();
      } else {
        alert("File open failed!");
      }
    } catch (e) {
      alert(`${e.name}
              ${e.message}
              (line #${e.line} in ${$.stack.match(/\[(.*?)\]/)[1]})`);
    }
  } else {
    alert("No CSV file selected.");
  }
  
  return outObj;
};

export { clean, getSpreadsheet };
