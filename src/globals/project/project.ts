import { createProject } from "../../classes/Project";

if (!(app.project && app.project.file)) {
  alert("Please open a template project before running the Sorcerer's Apprentice Script");
  throw Error("No project open");
}
const project = createProject(app.project.file.name);

export { project };
