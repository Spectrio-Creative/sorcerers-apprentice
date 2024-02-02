import { createProject } from "../../classes/Project";

if (!(app.project && app.project.file)) {
  alert(`No Project Open
  Please open a template project before running the Sorcerer's Apprentice Script.
  
  Note: you must save your project before running the script.
  
  Project exists: ${!!app.project}
  Project file exists: ${!!app.project?.file}
  `);
  throw Error("No project open");
}
const project = createProject(app.project.file.name);

export { project };
