import { Button } from '../button';
import { div, input } from "../elements";

const inlineBlock = () => "display: inline-block";

export const ColorField = (title: string): HTMLDivElement =>
  div(
    { class: "color-field input-field" },
    div({ class: "input-label", style: inlineBlock }, title),
    input({ type: "text", style: inlineBlock }),
    Button("Picker", () => console.log("Picker"), 90)
  );
