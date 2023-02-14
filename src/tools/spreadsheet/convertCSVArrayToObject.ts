import { clean } from "./tools";

function convertCSVArrayToObject(strArray:string[]) {
  let keys = strArray[0].split(",");
  const newObj = [];

  keys = clean(keys);

  for (let x = 1; x < strArray.length; x++) {
    const tempObj = {},
      tempArr = strArray[x].split(",");

    for (let i = 0; i < keys.length; i++) {
      const tempValue = tempArr[i].replace(/\\;/g, ",").replace(/\\m/g, "\n");
      tempObj[keys[i].toLowerCase()] = /^".*[\n]*.*"$/.test(tempValue)
        ? tempValue.slice(1, -1)
        : tempValue;
    }

    newObj.push(tempObj);
  }

  return newObj;
}

export { convertCSVArrayToObject };
