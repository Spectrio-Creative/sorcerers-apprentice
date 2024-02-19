// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

// Create 'dist' folder if it doesn't exist or clear it if it does
if (fs.existsSync("dist")) fs.rmSync("dist", { recursive: true });
fs.mkdirSync("dist");

// Create 'dist/CSXS' folder if it doesn't exist
if (!fs.existsSync("dist/CSXS")) {
  fs.mkdirSync("dist/CSXS");
}

// Move 'packages/host/dist/index.jsx' to 'dist/index.jsx'
// fs.copyFileSync("packages/host/dist/index.jsx", "dist/index.jsx");
fs.copyFileSync("packages/host/build/sorcerers_apprentice.jsx", "dist/index.jsx");

// Read package.json and get the current version
const packageJSON = JSON.parse(fs.readFileSync("package.json", "utf8"));

// Read "setup/manifest.xml" and replace the placeholder with the current version
let manifest = fs.readFileSync("setup/manifest.xml", "utf8");
manifest = manifest
  .replaceAll("{{FULL_VERSION}}", packageJSON.version)
  .replaceAll("{{SHORT_VERSION}}", packageJSON.version.split(".").slice(0, 2).join("."));

// Write the modified manifest to 'dist/CSXS/manifest.xml'
fs.writeFileSync("dist/CSXS/manifest.xml", manifest);

// Move 'packages/host/dist/setup/.debug' to 'dist/.debug'
fs.copyFileSync("setup/.debug", "dist/.debug");

// Move 'packages/client/public' to 'dist/client'
fs.cpSync("packages/client/dist", "dist/client", { recursive: true });
