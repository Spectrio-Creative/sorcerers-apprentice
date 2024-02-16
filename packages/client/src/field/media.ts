import { Button } from '../button';
import { div, input } from "../elements";

const inlineBlock = () => "display: inline-block";

export const MediaField = (title: string): HTMLDivElement =>
  div(
    { class: "media-field input-field" },
    div({ class: "input-label", style: inlineBlock }, title),
    input({ type: "text", style: inlineBlock }),
    Button("Browse", () => console.log("Browse"), 90)
  );
