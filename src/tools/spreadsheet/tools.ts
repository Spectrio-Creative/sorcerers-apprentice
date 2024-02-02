import { csvToJSON } from "./convertCSVArrayToObject";

const getSpreadsheet = (csvFile: File): GenericObject[] => {
  if (csvFile != null) {
    try {
      const fileOK = csvFile.open("r");
      if (fileOK) {
        let text: string;
        let textAccumulatorString = "";
        while (!csvFile.eof) {
          text = csvFile.readln();
          textAccumulatorString += `\n${text}`;
        }

        const outObj: GenericObject[] = csvToJSON(textAccumulatorString, {
          transformHeader: (header) => header.toLowerCase(),
          skipShortLines: true,
          transform: (value) => value.trim(),
        });

        csvFile.close();

        return outObj;
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

  return [];
};

export { getSpreadsheet };
