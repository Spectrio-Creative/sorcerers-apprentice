export interface AsRegExOptions {
  strict?: boolean;
  stringSearch?: boolean;
  coerce?: boolean;
  flags?: string;
}

const defaultAsRegExOptions: AsRegExOptions = {
  strict: false,
  coerce: false,
  flags: "g",
};

export function asRegEx<T>(search: T, options: AsRegExOptions = defaultAsRegExOptions): RegExp {
  if (search instanceof RegExp) return search;
  // If not coerce, escape all special characters.
  const coerce = typeof options.stringSearch === "boolean" ? options.stringSearch : options.coerce;
  const strict = options.strict;

  if (typeof search === "string" || typeof search === "number") {
    let searchString = `${search}`;
    if (!coerce) searchString = escapeRegExp(`${searchString}`);
    if (strict) return new RegExp(`^${searchString}$`, options.flags);
    return new RegExp(`${searchString}`, options.flags);
  }
  throw new Error("Invalid search type");
}

// function escapeRegex(text: string) {
//   return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
// }


export function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}