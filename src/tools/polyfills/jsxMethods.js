import { setUpArrayMethods } from "./array";
import { setUpObjectMethods } from "./object";
import { setUpStringMethods } from "./string";

function extendExtendscript() {
  $.setTimeout = function (func, time) {
    $.sleep(time);
    func();
  };

  Math.roundTo = (x, dec) => Math.round(x * dec) / dec;

  setUpArrayMethods();
  setUpStringMethods();
  setUpObjectMethods();
}

export { extendExtendscript };
