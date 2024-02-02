export function clean<T>(arr: T[]): T[] {
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== "" && arr[i] !== null && arr[i] !== undefined) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

export function convertCSVArrayToObject(strArray: string[]) {
  let keys = strArray[0].split(",");
  const newObj = [];

  keys = clean(keys);

  for (let x = 1; x < strArray.length; x++) {
    const tempObj = {},
      tempArr = strArray[x].split(",");

    for (let i = 0; i < keys.length; i++) {
      const tempValue = tempArr[i].replace(/\\;/g, ",").replace(/\\m/g, "\n");
      tempObj[keys[i].toLowerCase()] = /^".*[\n]*.*"$/.test(tempValue) ? tempValue.slice(1, -1) : tempValue;
    }

    newObj.push(tempObj);
  }

  return newObj;
}

interface ConverterOptions {
  delineator?: string;
  quotes?: string;
  transform?: (value: string) => string;
  transformHeader?: (header: string) => string;
  skipShortLines?: boolean;
}

export function givenOrDefault(options: ConverterOptions) {
  options = options || {};
  options.delineator = options.delineator || ",";
  options.quotes = options.quotes || "\"";
  options.skipShortLines = options.skipShortLines || false;
  options.transform = options.transform || ((value) => value);
  options.transformHeader = options.transformHeader || ((header) => header);
  return options;
}

export function csvToJSON(csvString: string, options?: ConverterOptions) {
  const { skipShortLines, quotes, delineator, transformHeader, transform } = givenOrDefault(options);
  const lineBreak = "LINE_BREAK";
  const delineatorBreak = "DELINEATOR_BREAK";
  const topRegEx = new RegExp(`${quotes}[\\W\\w]*?${quotes}|\\n`, "g");
  const lineRegEx = new RegExp(`${quotes}[\\W\\w]*?${quotes}|${delineator}`, "g");
  const lineArray = csvString
    .trim()
    .replace(topRegEx, (match) => {
      if (match === "\n") return lineBreak;
      return match;
    })
    .split(lineBreak);

  const csvArray = lineArray.map((csvLine) =>
    csvLine
      .replace(lineRegEx, (match) => {
        if (match === delineator) return delineatorBreak;
        return match;
      })
      .split(delineatorBreak)
      .map((value) => value.replace(/^"(.*)"$/, "$1"))
  );

  const headers = csvArray[0].map(transformHeader);

  const json: { [key: string]: string }[] = [];

  for (let i = 1; i < csvArray.length; i++) {
    const line = csvArray[i];
    if (skipShortLines && line.length < headers.length) continue;
    const lineObj: { [key: string]: string } = {};
    headers.forEach((header, i) => {
      lineObj[header] = transform(line[i] || "");
    });
    json.push(lineObj);
  }

  return json;
}
