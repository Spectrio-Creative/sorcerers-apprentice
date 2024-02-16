import { a, div } from './elements';

export const Button = (text: string, func: () => void, width?: number) => {
    const widthStyle = width ? `width: calc(${width}px - 3em);` : '';
  return div({class: "btn"}, a({ href: "#", onclick: func, style: () => widthStyle }, text));
};
