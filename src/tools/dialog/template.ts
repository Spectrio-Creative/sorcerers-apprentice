import extend from "just-extend";

const mapMenu = (menu: TabbedPanel) => {
  const map = Object.entries(menu);
  const output: GenericObject = {};
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

const isMatch = (
  a:string,
  b:string,
  options?: {
    whitespace?: "i" | "ignore" | "s" | "show";
    case?: "i" | "insensitive" | "s" | "sensitive";
    match?: "exact" | "partial"
  }
):boolean => {
  if(typeof a !== "string" || typeof b !== "string") return false;
  options = extend({}, { case: "i", whitespace: "s" }, options);
  if (options.whitespace === "i" || options.whitespace === "ignore") {
    a = a.replace(/\W/g, "");
    b = b.replace(/\W/g, "");
  }
  if (options.case === "i" || options.case === "insensitive") {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }
  if (options.match === "partial") {
    return a.includes(b);
  }
  return a === b;
};

const findPathByKey = (
  obj: { [key: string]: any },
  key?: string,
  options?: { pathInProgress?: string; allFullPaths?: boolean; includes?: string }
):string[] => {
  options = extend({}, { pathInProgress: "" }, options);
  const entries = Object.entries(obj);
  const output = [];
  entries.forEach(([k, v]) => {
    if (isMatch(k, key)) {
      output.push(`${options.pathInProgress}${k}`);
    }

    if (typeof v === "object") {
      const path = options.pathInProgress + (Array.isArray(obj) ? `[${k}].` : `${k}.`);
      const newOptions = extend({}, options, { pathInProgress: path });
      const result = findPathByKey(v, key, newOptions);
      output.push(...result);
    } else if (options.allFullPaths) {
      output.push(`${options.pathInProgress}${k}`);
    }
  });

  const filtered = options.includes
    ? output.filter((path) => new RegExp(options.includes, "i").test(path))
    : output;
  return filtered;
};

const getFilePaths = (obj: { [key: string]: any }):string[] => {
  return findPathByKey(obj, undefined, { allFullPaths: true });
};

export { mapMenu, findPathByKey, getFilePaths };
