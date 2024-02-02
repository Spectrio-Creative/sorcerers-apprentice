import { status } from "../globals/project/status";

export function statusClass() {
  const remove = status.addListener((text) => {
    alert(`Status: ${text}`);
  });

  // status.text = "Hello World!";
  status.update("Hello World!");

  // status.text = "Goodbye World!";
  status.update("Goodbye World!");

  remove();

  // status.text = "You shouldn't see this.";
  status.update("You shouldn't see this.");
}
