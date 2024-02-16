// Modify the generated JavaScript files
import fs from 'fs';
import * as glob from 'glob';

const targetDir = './dist/assets';
const files = glob.sync(`${targetDir}/*.js`);

const html = './dist/index.html'

files.forEach(fileName => {
  let fileContent = fs.readFileSync(html, 'utf8');

  console.log(`Processing ${fileName}...`, fileContent);

  // Replace `<script type="module">` with `<script defer type="text/javascript">`
  fileContent = fileContent.replace('<script type="module"', '<script defer type="text/javascript"');

  // Replace `<script>` with `<script defer>`
//   fileContent = fileContent.replace('<script>', '<script defer>');

  console.log(`Writing ${fileName}...`, fileContent);

  // Write the modified content to the file
  fs.writeFileSync(html, fileContent, 'utf8');
});