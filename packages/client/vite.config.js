// vite.config.js
import legacy from "@vitejs/plugin-legacy";
import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  build: {
    commonjsOptions: {},
    rollupOptions: {
      input: {
        traditional: resolve(__dirname, "index-traditional.html"),
        spreadsheet: resolve(__dirname, "index-spreadsheet.html"),
      },
      // input: {
      //   traditional: resolve(__dirname, "index-traditional.html"),
      //   spreadsheet: resolve(__dirname, "index-spreadsheet.html"),
      // },
      output: {
        format: "commonjs",
        // format: "esm",
        // format: "cjs",
      },
    },
  },
});
