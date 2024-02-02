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
