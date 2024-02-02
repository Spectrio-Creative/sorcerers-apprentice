import camelCase from "just-camel-case";

export function spaceCase(string: string): string {
  // These could be combined into fewer regexes, but using the or operator
  // acts weirdly in Adobe ExtendScript.
  return camelCase(string)
    .replace(/[a-z][A-Z]/g, (match) => `${match[0]} ${match[1]}`)
    .replace(/([A-Z])([A-Z][a-z])/g, (match) => `${match[0]} ${match[1]}${match[2]}`)
    .replace(/[0-9][a-zA-Z]/g, (match) => `${match[0]} ${match[1]}`)
    .replace(/([a-zA-Z])([0-9])/g, (match) => `${match[0]} ${match[1]}`);
}

export function capitalCase(string: string): string {
  // Eaqually, this could easily be one regex, but using the or operator
  // acts weirdly in Adobe ExtendScript.
  return spaceCase(string)
    .replace(/^\w/g, (sub) => sub.toUpperCase())
    .replace(/\s\w/g, (sub) => sub.toUpperCase());
}
