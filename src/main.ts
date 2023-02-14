import { version as scriptVersion } from "../package.json";
import ui from "./uiGroupTemplates";
import sa_262 from "../static/sorcerers_apprentice_script_2_6_2_spreadsheet.js";
import { prepare } from "./tools/setup";
import { project } from "./globals/globals";

// class TestClass {
//   firstName: string;
//   lastName: string;
//   fullName: string;

//   constructor(name:string, lastName?:string) {
//     if(lastName) {
//       this.firstName = name;
//       this.lastName = lastName;
//     } else {
//       const nameParts = name.split(" ");
//       this.firstName = nameParts[0];
//       this.lastName = nameParts[1] || "";
//     }
//   }
// }

const main = () => {
  prepare();
  const initialized = project.initialize(scriptVersion);
  if(!initialized) return;

  sa_262(ui);
};

main();