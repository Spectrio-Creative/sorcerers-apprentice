const fs = require("fs-extra");

const copyDependancies = () => {
  fs.copySync("./post/Dependancies", "./build/dependancies");
  const oldPath = "./build/dependancies/The Sorcerer's Apprentice.jsx";
  const newPath = "./build/The Sorcerer's Apprentice.jsx";
  if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
  fs.moveSync(oldPath, newPath);
};

copyDependancies();
