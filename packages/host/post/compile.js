const fs = require("fs");
const strip = require("strip-comments");
console.log("afterAMEFormats.js");

// Prepend the following snippet to the file: ./src/tools/ame/presetsCompiled.ts
const prepend = `const ameScript = \``;
// Append the following snippet to the file: ./src/tools/ame/presetsCompiled.ts
const append = `\`;`;

const template = fs.readFileSync("./src/tools/ame/formatsAE.ts", "utf8");
const file = fs.readFileSync("./src/tools/ame/formatsAECompiled.ts", "utf8");

const fileContent = template.replace(
  "{{AME_SCRIPT}}",
  strip(file, { line: true, block: true, keepProtected: false })
    .replace("export { writeFormatsJSON };", "")
    // .replace(/"/g, '\\"')
    // .replace(/\n/g, "\\\n")
);

const sourceMapURL = (file.match(/\/\/# sourceMappingURL=(.*)/) || [])[1];

// Remove sourceMappingURL file
if (sourceMapURL) {
  fs.unlinkSync(`./src/tools/ame/${sourceMapURL}`);
}

fs.writeFileSync("./src/tools/ame/formatsAECompiled.ts", fileContent, "utf8");
