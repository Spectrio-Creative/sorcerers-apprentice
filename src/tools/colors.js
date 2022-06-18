// TO DO: Replace with polyfill
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

//Convert hex to rgb
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

//Convert rgb to hex
function rgbToHex(rgb) {
  if (Array.isArray(rgb) === false) {
    rgb = rgb.split(/ *, */);
  }

  var elToHex = function (el) {
    var hex = Number(el).toString(16);

    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  };
  return elToHex(rgb[0]) + elToHex(rgb[1]) + elToHex(rgb[2]);
}

//convert rbg to decimals
function colorize(rgbCode) {
  var colorCodes = rgbCode.match(/[0-9]+/g),
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
function decToRgb(decimal) {
  var alpha = decimal.length === 4 ? true : false;
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

function colorpicker(original_color) {
  var hexToRGB = function (hex) {
    var r = hex >> 16;
    var g = (hex >> 8) & 0xff;
    var b = hex & 0xff;
    return [r, g, b];
  };

  var color_decimal =
    $.os.indexOf("Windows") !== -1
      ? $.colorPicker()
      : $.colorPicker("0x" + rgbToHex(decToRgb(original_color)));
  $.writeln(color_decimal);
  var color_hexadecimal = color_decimal.toString(16);
  $.writeln(color_hexadecimal);
  var color_rgb = hexToRGB(parseInt(color_hexadecimal, 16));
  $.writeln(color_rgb);
  var result_color = [color_rgb[0] / 255, color_rgb[1] / 255, color_rgb[2] / 255];
  $.writeln(result_color);
  return result_color;
  //   return color_rgb;
}

export { colorize, hexToRgb, decToRgb, rgbToHex, colorpicker };
