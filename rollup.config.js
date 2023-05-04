import json from "@rollup/plugin-json";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
// import eslint from "@rollup/plugin-eslint";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { string } from "rollup-plugin-string";
// import cleanup from 'rollup-plugin-cleanup';
// import findUnused from "rollup-plugin-unused";
import include from "rollup-plugin-include";
import typescript from "@rollup/plugin-typescript";

// rollup.config.js
export default {
  input: process.env.ENTRY || "src/main.ts",
  output: {
    file: process.env.OUTPUT || "build/sorcerers_apprentice.jsx",
    format: "esm",
    sourcemap: false,
  },

  plugins: [
    // process.env.ENTRY
    //   ? findUnused({ exclude: ["src/**"] })
    //   : findUnused({ exclude: ["src/playground.js", "**/_*.js"] }),
    typescript(),
    nodeResolve(),
    commonjs({
      include: /node_modules/,
    }),
    string({
      include: ["actions/*", "static/*"],
      exclude: ["node_modules/*", "static/sorcerers_apprentice_script_2_6_2_spreadsheet.js"],
    }),
    // eslint({ throwOnError: true, fix: true }),
    json(),
    include(),
    // cleanup(),
    getBabelOutputPlugin({ presets: ["extendscript"] }),
  ],
};
