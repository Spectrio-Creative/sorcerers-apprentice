import { convertCSVArrayToObject } from "./convertCSVArrayToObject";

function clean(arr) {
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== "" && arr[i] !== null && arr[i] !== undefined) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

const getSpreadsheet = (csvFile: File) => {
  let outObj: { [key: string]: any };
  if (csvFile != null) {
    try {
      // open file
      const fileOK = csvFile.open("r");
      // const thisFile = inputFile;
      const textAccumulator: string[] = [];
      if (fileOK) {
        let text: string;
        while (!csvFile.eof) {
          text = csvFile.readln();

          textAccumulator.push(
            text
              .replace(/,(?!(?:[^"]|"[^"]*")*$)/g, "\\;")
              .replace(/\\n(?!(?:[^"]|"[^"]*")*$)/g, "\\m")
          );
        }

        outObj = convertCSVArrayToObject(textAccumulator);

        csvFile.close();
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
