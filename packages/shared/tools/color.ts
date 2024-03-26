//Convert hex to rgb
export function hexToRgb(hex: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (_m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
  if (!result) return null;

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: parseInt(result[4], 16) || 255
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

  colors = colors.filter((_v, i) => i < 4);
  colors = colors
    .map((v) => (typeof v === "string" ? Number(v.trim()) : v))
    .map((v) => (typeof v === "number" ? v / 255 : 1));
  while (colors.length < 4) colors.push(1);
  return colors as [number, number, number, number];
}

//convert rbg to decimals
export function decimalToRgb(decimal: RGB | RGBA, string = false): RGB | RGBA | string {
  let alpha = decimal.length === 4 ? true : false;
  if (alpha && decimal[3] === 1) alpha = false;

  const rgb: RGB | RGBA = [Math.round(decimal[0] * 255), Math.round(decimal[1] * 255), Math.round(decimal[2] * 255)];

  if (alpha && decimal[3]) rgb.push(Math.round(decimal[3] * 255));

  if (string) {
    return alpha ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${decimal[3]})` : `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }

  return rgb;
}

export function parseColorFromString(color: string): RGBA {
  const matchRGB = (str: string) => new RegExp(`(?:${str} *, *){2,3} *(?:${str} *)`);
  const eightBit = matchRGB("(?:[0-9]{1,3})");
  const decimalMatch = matchRGB("(?:[01]?(?:\\.[0-9]+)?)");

  color = color.replace(/ /g, "");
  if (/^#/.test(color)) {
    const rgb = hexToRgb(color);
    if (rgb) return eightBitToDecimal([rgb.r, rgb.g, rgb.b]);
  } else if (decimalMatch.test(color)) {
    const decimal = (color.match(decimalMatch) || ["0, 0, 0, 1"])[0];
    return decimal.split(/ *, */).map(Number) as RGBA;
  } else if (eightBit.test(color)) {
    const rgb = (color.match(eightBit) || ["0, 0, 0, 255"])[0];
    return eightBitToDecimal(rgb);
  }

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
