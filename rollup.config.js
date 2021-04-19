import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import { eslint } from "rollup-plugin-eslint";
import cleanup from 'rollup-plugin-cleanup';

// rollup.config.js
export default {
  input: "src/main.js",
  output: [
    {
      file: "build/sorcerers_apprentice.jsx",
      format: "esm",
    },
    {
      file: "build/sorcerers_apprentice.min.jsx",
      format: "esm",
      name: "version",
      plugins: [terser()],
    },
  ],
  plugins: [
    json(),
    cleanup(),
    eslint(),
    getBabelOutputPlugin({ presets: ["extendscript"] }),
  ],
};
