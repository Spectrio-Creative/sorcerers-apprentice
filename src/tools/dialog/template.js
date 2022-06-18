import extend from "just-extend";

const mapMenu = (menu) => {
  const map = Object.entries(menu);
  const output = {};
  map.forEach(([key, val]) => {
    // If the value is an object
    // then it might be one we want
    if (
      key !== "parent" &&
      key !== "selection" &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      val !== null
    ) {
      // If it has the key 'ss_type' then we know that it
      // is one of the menu items that we've made visible
      if (val.ss_type) {
        const children = mapMenu(val);
        output[key] = children;
        if (Object.keys(children).length === 0) {
          output[key] = val.ss_type;
        }
      }
    }
  });
  return output;
};

// To Do: move these methods to a more sensable file location:

const isMatch = (a, b, options) => {
  options = options || {};
  const op = extend({}, { case: "i", whitespace: "s" }, options);
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (op.whitespace === "i" || op.whitespace === "ignore") {
    a = a.replace(/\W/g, "");
    b = b.replace(/\W/g, "");
  }
  if (op.case === "i" || op.case === "insensitive") {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }
  if (op.match === "partial") {
    return a.includes(b);
  }
  return a === b;
};

const findPathByKey = (obj, key, options) => {
  options = extend({}, { pathInProgress: "" }, options);
  const entries = Object.entries(obj);
  const output = [];
  entries.forEach(([k, v]) => {
    if (isMatch(k, key, options)) {
      output.push(`${options.pathInProgress}${k}`);
    }

    if (typeof v === "object") {
      const path = options.pathInProgress + (Array.isArray(obj) ? `[${k}].` : `${k}.`);
      const newOptions = extend({}, options, { pathInProgress: path });
      const result = findPathByKey(v, key, newOptions);
      output.push(...result);
    } else if(options.allFullPaths) {
      output.push(`${options.pathInProgress}${k}`);
    }
  });

  const filtered = options.includes
    ? output.filter((path) => new RegExp(options.includes, "i").test(path))
    : output;
  return filtered;
};

const getFilePaths = (obj) => {
  return (findPathByKey(obj, undefined, {allFullPaths: true}));
};

export { mapMenu, findPathByKey, getFilePaths };
