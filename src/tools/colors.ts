// TO DO: Replace with polyfill
export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

//Convert hex to rgb
export function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

//Convert rgb to hex
export function rgbToHex(rgb) {
  if (Array.isArray(rgb) === false) {
    rgb = rgb.split(/ *, */);
  }

  const elToHex = function (el) {
    let hex = Number(el).toString(16);

    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  };
  return elToHex(rgb[0]) + elToHex(rgb[1]) + elToHex(rgb[2]);
}

//convert rbg to decimals
export function colorize(rgbCode:string):[number, number, number, number] {
  const colorCodes = rgbCode.match(/[0-9]+/g),
    // alpha = colorCodes.length,
    vals = [
      colorCodes[0] == undefined ? 255 : Number(trim(colorCodes[0])),
      colorCodes[1] == undefined ? 255 : Number(trim(colorCodes[1])),
      colorCodes[2] == undefined ? 255 : Number(trim(colorCodes[2])),
      colorCodes[3] == undefined ? 255 : Number(trim(colorCodes[3])),
    ];
  return [vals[0] / 255, vals[1] / 255, vals[2] / 255, vals[3] / 255];
}

//convert rbg to decimals
export function decToRgb(decimal) {
  let alpha = decimal.length === 4 ? true : false;
  if (alpha && decimal[3] === 1) alpha = false;
  return (
    Math.round(decimal[0] * 255) +
    "," +
    Math.round(decimal[1] * 255) +
    "," +
    Math.round(decimal[2] * 255) +
    (alpha ? "," + Math.round(decimal[3] * 255) : "")
  );
}

export function colorpicker(original_color) {
  const hexToRGB = function (hex) {
    const r = hex >> 16;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return [r, g, b];
  };

  const color_decimal =
    $.os.indexOf("Windows") !== -1
      ? $.colorPicker(0)
      : $.colorPicker(("0x" + rgbToHex(decToRgb(original_color))) as any);
  $.writeln(color_decimal);
  const color_hexadecimal = color_decimal.toString(16);
  $.writeln(color_hexadecimal);
  const color_rgb = hexToRGB(parseInt(color_hexadecimal, 16));
  $.writeln(color_rgb);
  const result_color = [color_rgb[0] / 255, color_rgb[1] / 255, color_rgb[2] / 255];
  $.writeln(result_color);
  return result_color;
  //   return color_rgb;
}

export const GoodBoyNinjaColorPicker = (
  startValue: [number, number, number] | [number, number, number, number] = [1, 1, 1]
) => {
  // find the active comp
  const comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    alert("Please open a comp first");
    return [];
  }

  // add a temp null;
  const newNull = comp.layers.addNull();
  const newColorControl = (newNull("ADBE Effect Parade") as any).addProperty("ADBE Color Control");
  const theColorProp = newColorControl("ADBE Color Control-0001");

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

  // if the user click cancel, the function will return the start value but as RGBA. In that case, return null
  const startValueInRgba = [startValue[0], startValue[1], startValue[2], startValue[3] || 1];

  return result.toString() == startValueInRgba.toString() ? null : result;
};
