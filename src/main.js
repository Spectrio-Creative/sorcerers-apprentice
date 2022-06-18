// Illustrator reserves the keyword 'version', but we need it for our own version;
let version = 1;
let aiVersion = version;
console.log(aiVersion);
import { version as scriptVersion } from "../package.json";

import ui from "./uiGroupTemplates";
import sa_262 from "../static/sorcerers_apprentice_script_2_6_2_spreadsheet.jsx";
import { prepare } from "./tools/setup";
import { project } from "./globals/globals";

const main = () => {
  prepare();
  const initialized = project.initialize(scriptVersion);
  if(!initialized) return;

  project.log("Hello!");
  
  sa_262(ui);
};

main();