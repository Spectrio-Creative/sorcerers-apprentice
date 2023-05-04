export function customEach(arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}

export function arrIndex(arr, str) {
  if (arr === null) return -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == str) return i;
  }
  return -1;
}

export function copyObj(src) {
  const target = {};
  for (const prop in src) {
    if (Object.prototype.hasOwnProperty.call(src, prop)) {
      if (prop === "parent" || prop === "children" || prop === "window") {
        continue;
      }

      if (typeof src[prop] === "object") {
        try {
          target[prop] = copyObj(src[prop]);
        } catch (error) {
          target[prop] = src[prop];
        }
      } else {
        target[prop] = src[prop];
      }
    }
  }

  return target;
}
