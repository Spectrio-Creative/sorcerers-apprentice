const fs = require("fs");
const strip = require("strip-comments");
console.log("afterAMEPresets.js");

// Prepend the following snippet to the file: ./src/tools/ame/presetsCompiled.ts
const prepend = `const ameScript = \``;
// Append the following snippet to the file: ./src/tools/ame/presetsCompiled.ts
const append = `\`;`;

const template = fs.readFileSync("./src/tools/ame/presetsAE.ts", "utf8");
const file = fs.readFileSync("./src/tools/ame/presetsCompiled.ts", "utf8");

const fileContent = template.replace(
  "{{AME_SCRIPT}}",
  strip(file, { line: true, block: true, keepProtected: false })
    .replace("export { writePresetsJSON };", "")
    // .replace(/"/g, '\\"')
    // .replace(/\n/g, "\\\n")
);

const sourceMapURL = (file.match(/\/\/# sourceMappingURL=(.*)/) || [])[1];

// Remove sourceMappingURL file
if (sourceMapURL) {
  fs.unlinkSync(`./src/tools/ame/${sourceMapURL}`);
}

fs.writeFileSync("./src/tools/ame/presetsCompiled.ts", fileContent, "utf8");
