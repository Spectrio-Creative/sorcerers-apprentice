import { div, input } from "../elements";

const inlineBlock = () => "display: inline-block";

export const TextField = (title: string): HTMLDivElement =>
  div(
    { class: "text-field input-field" },
    div({ class: "input-label", style: inlineBlock }, title),
    input({ type: "text", style: inlineBlock })
  );
