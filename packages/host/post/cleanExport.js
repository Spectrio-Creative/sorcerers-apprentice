const fs = require('fs');
const path = require('path');

// Remove text `export { createSSNamespace };` from ../build/sorcerers_apprentice.jsx
const filePath = path.resolve(__dirname, '../build/sorcerers_apprentice.jsx');
const fileContent = fs.readFileSync(filePath, 'utf8');
const newFileContent = fileContent.replace('export { createSSNamespace };', '');
fs.writeFileSync(filePath, newFileContent);