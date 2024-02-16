// import fontManager from 'font-scanner';
import { defineConfig } from 'vite';

// vite.config.js
// const fonts = fontManager.getAvailableFontsSync();

// fonts.filter(font => /montserrat/i.test(font.family)).forEach((font) => {
//   console.log(font.postscriptName);
// });

// console.log(fonts);
export default defineConfig({
  base: './',
  // root: "./public"
})