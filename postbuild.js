/* eslint-disable */
const fs = require("fs");
const path = require("path");
// const strip = require("strip-comments");

// // strip comments from ./build/sorcerers_apprentice2.jsx
// const sorcerers_apprentice2 = fs.readFileSync(path.resolve(__dirname, "./build/sorcerers_apprentice2.jsx"), "utf8");
// fs.writeFileSync(path.resolve(__dirname, "./build/sorcerers_apprentice2.jsx"), strip(sorcerers_apprentice2));

// Remove sorcereres_apprentice.js from the build folder
fs.unlinkSync(path.resolve(__dirname, "./build/sorcerers_apprentice.js"));
