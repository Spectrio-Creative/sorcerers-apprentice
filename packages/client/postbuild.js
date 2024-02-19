// Modify the generated JavaScript files
import fs from "fs";
// import { globSync } from "glob";

// const targetDir = "./dist/assets";
// const files = globSync(`${targetDir}/*.js`);

// const htmlTraditional = "./dist/index-traditional.html";
// const htmlSpreadsheet = "./dist/index-spreadsheet.html";


[].forEach((html) => {
  let fileContent = fs.readFileSync(html, "utf8");

  // Replace the script tag with a defer attribute
  fileContent = fileContent.replace('<script type="module"', '<script defer type="text/javascript"');

  // Write the modified content to the file
  fs.writeFileSync(html, fileContent, "utf8");
});
