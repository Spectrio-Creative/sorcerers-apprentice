import { searchLibrary } from "./project";

//Convert hex to rgb
export function hexToRgb(hex: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export const elToHex = function (el: number) {
  let hex = Number(el).toString(16);
  while (hex.length < 2) hex = "0" + hex;
  return hex;
};

//Convert rgb to hex
export function rgbToHex(rgb: string | number[]) {
  if (typeof rgb === "string") {
    rgb = rgb.split(/ *, */).map(Number);
  }
  return elToHex(rgb[0]) + elToHex(rgb[1]) + elToHex(rgb[2]);
}

//convert rbg to decimals
export function eightBitToDecimal(rgbCode: string | RGB | RGBA): [number, number, number, number] {
  let colors: (string | number)[] = typeof rgbCode === "string" ? rgbCode.match(/[0-9]+/g) || [] : rgbCode;

  colors = colors.filter((v, i) => i < 4);
  colors = colors
    .map((v) => (typeof v === "string" ? Number(v.trim()) : v))
    .map((v) => (typeof v === "number" ? v / 255 : 1));
  while (colors.length < 4) colors.push(1);
  return colors as [number, number, number, number];
}

export type RGB = [number, number, number];
export type RGBA = [number, number, number, number];

//convert rbg to decimals
export function decimalToRgb(decimal: RGB | RGBA, string = false): RGB | RGBA | string {
  let alpha = decimal.length === 4 ? true : false;
  if (alpha && decimal[3] === 1) alpha = false;

  const rgb: RGB | RGBA = [Math.round(decimal[0] * 255), Math.round(decimal[1] * 255), Math.round(decimal[2] * 255)];

  if (alpha) rgb.push(Math.round(decimal[3] * 255));

  if (string) {
    return alpha ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${decimal[3]})` : `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }

  return rgb;
}

export const GoodBoyNinjaColorPicker = (startValue: RGB | RGBA = [1, 1, 1, 1]): RGBA => {
  startValue = [startValue[0], startValue[1], startValue[2], startValue[3] || 1];
  // find the active comp
  let comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    // find a comp to open
    comp = searchLibrary(/.*/g, { type: "Composition", recursive: true, maxResult: 1 })[0];
  }

  if (!comp || !(comp instanceof CompItem)) {
    alert("Please open a comp first");
    return startValue;
  }

  comp.openInViewer();

  // add a temp null;
  const newNull = comp.layers.addNull();
  const newColorControl = (newNull("ADBE Effect Parade") as PropertyGroup).addProperty(
    "ADBE Color Control"
  ) as PropertyGroup;
  const theColorProp = newColorControl("ADBE Color Control-0001") as Property;

  // shy and turn eyeball off
  newNull.shy = true;
  newNull.enabled = false;
  newNull.name = "tempColorPicker";

  // set the value given by the function arguments
  theColorProp.setValue(startValue);

  // prepare to execute
  const editValueID = 2240; // or app.findMenuCommandId("Edit Value...");
  theColorProp.selected = true;
  app.executeCommand(editValueID);

  // harvest the result
  const result = theColorProp.value;

  // remove the null
  if (newNull) {
    newNull.remove();
  }

  return result;

  // if the user click cancel, the function will return the start value but as RGBA. In that case, return null
  // const startValueInRgba = [startValue[0], startValue[1], startValue[2], startValue[3] || 1];

  // return result.toString() == startValueInRgba.toString() ? null : result;
};

export function parseColorFromString(color: string): RGBA {
  const matchRGB = (str: string) => new RegExp(`(?:${str} *, *){2,3} *(?:${str} *)`);
  const eightBit = matchRGB("(?:[0-9]{1,3})");
  const decimalMatch = matchRGB("(?:[01]?(?:\\.[0-9]+)?)");

  color = color.replace(/ /g, "");
  if (/^#/.test(color)) {
    const rgb = hexToRgb(color);
    return eightBitToDecimal([rgb.r, rgb.g, rgb.b]);
  } else if (decimalMatch.test(color)) {
    const decimal = color.match(decimalMatch)[0];
    return decimal.split(/ *, */).map(Number) as RGBA;
  } else if (eightBit.test(color)) {
    const rgb = color.match(eightBit)[0];
    return eightBitToDecimal(rgb);
  } 
  alert("Step 6");

  // If all else fails, return black
  return [0, 0, 0, 1];
}

export function formatAsDecimal(color: string | number[]): RGBA {
  if (typeof color === "string") return parseColorFromString(color);

  color = color.map(Number);

  if (color.some((v) => v > 1)) return eightBitToDecimal(color as RGB);

  while (color.length < 3) color.push(0);
  while (color.length < 4) color.push(1);

  return color.map((v) => (typeof v === "number" ? v : 1)) as RGBA;
}
