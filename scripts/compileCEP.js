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
fs.copyFileSync("packages/host/sorcerers_apprentice.jsx", "dist/index.jsx");

// Move 'packages/host/dist/manifest.xml' to 'dist/CSXS/manifest.xml'
fs.copyFileSync("setup/manifest.xml", "dist/CSXS/manifest.xml");

// Move 'packages/host/dist/setup/.debug' to 'dist/.debug'
fs.copyFileSync("setup/.debug", "dist/.debug");

// Move 'packages/client/public' to 'dist/client'
fs.cpSync("packages/client/dist", "dist/client", { recursive: true });
