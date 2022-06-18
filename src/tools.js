function customEach(arr, callback) {
  for (var i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}

function arrIndex(arr, str) {
  if (arr === null) return -1;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == str) return i;
  }
  return -1;
}

function copyObj(src) {
  var target = {};
  for (var prop in src) {
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

export { customEach, copyObj, arrIndex };
