import json from "@rollup/plugin-json";
import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { string } from "rollup-plugin-string";
import cleanup from "rollup-plugin-cleanup";
import findUnused from "rollup-plugin-unused";
import include from "rollup-plugin-include";
import typescript from "@rollup/plugin-typescript";
// import stripComments from "./plugins/strip";
import fs from "fs";

const shims = fs.readFileSync(require.resolve("extendscript-es5-shim"));
const json2 = fs.readFileSync("./static/json2.js");

// rollup.config.js
export default {
  input: process.env.ENTRY || "src/main.ts",
  output: {
    file: process.env.OUTPUT || "build/sorcerers_apprentice.jsx",
    format: "esm",
    sourcemap: false,
    banner: `${shims}\n${json2}\n`,
  },
  plugins: [
    findUnused({ exclude: ["src/playground.js", "**/_*.js", "src/playground"] }),
    typescript({ tsconfig: "tsconfig.json", include: ["src/**/*", "../shared/**/*"]}),
    nodeResolve(),
    commonjs({
      include: [/node_modules/, /shared/],
    }),
    string({
      include: ["actions/*", "static/*"],
      exclude: ["node_modules/*", "static/sorcerers_apprentice_script_2_6_2_spreadsheet.js"],
    }),
    json(),
    include(),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
      extensions: [".ts", ".js"],
      exclude: "node_modules/**",
      plugins: [
        "babel-plugin-transform-es3-member-expression-literals",
        "babel-plugin-transform-es3-property-literals",
        "babel-plugin-transform-es5-property-mutators",
      ],
    }),
    cleanup(),
    // getBabelOutputPlugin({ presets: ["extendscript"] }),
    // stripComments(),
  ],
};
