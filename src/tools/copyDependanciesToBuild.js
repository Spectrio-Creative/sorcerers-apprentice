
const fs = require("fs-extra");


fs.copySync('./Dependancies', './build/dependancies')
const oldPath = "./build/dependancies/The Sorcerer's Apprentice.jsx";
const newPath = "./build/The Sorcerer's Apprentice.jsx";
if(fs.existsSync(newPath)) fs.unlinkSync(newPath);
fs.moveSync(oldPath, newPath)

