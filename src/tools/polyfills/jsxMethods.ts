import { setUpArrayMethods } from "./array";
import { setUpObjectMethods } from "./object";
import { setUpStringMethods } from "./string";

declare global {
  interface $ {
    setTimeout: (callback:()=>void, delay:number) => void;
  }

  interface Math {
    roundTo: (float: number, dec: number) => number;
  }
}

function extendExtendscript() {
  $.setTimeout = function (func, time) {
    $.sleep(time);
    func();
  };

  Math.roundTo = (float, dec) => Math.round(float * dec) / dec;

  setUpArrayMethods();
  setUpStringMethods();
  setUpObjectMethods();
}

export { extendExtendscript };
