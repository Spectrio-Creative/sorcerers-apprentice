import { setUpArrayMethods } from "../tools/polyfills/array";

export function arrayIndex() {
  setUpArrayMethods();

  const testingArray = ["a", "b", "c", "d", "e"];

  const index = testingArray.indexOf("c");

  alert(`Index of "c": ${index}`);

  const index2 = testingArray.indexOf("f");

  alert(`Index of "f": ${index2}`);

  alert(`Index of "c" in empty array: ${[].indexOf("c")}`);
}
