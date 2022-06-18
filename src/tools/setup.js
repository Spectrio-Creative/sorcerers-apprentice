import { extendExtendscript } from "./polyfills/jsxMethods";
import { forceInclusions } from "./forceInclusions";

const prepare = () => {
  forceInclusions();
  extendExtendscript();
};

export { prepare };
