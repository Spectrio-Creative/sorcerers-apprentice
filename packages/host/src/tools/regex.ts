export interface AsRegExOptions {
  strict?: boolean;
  stringSearch?: boolean;
  coerce?: boolean;
}

const defaultAsRegExOptions: AsRegExOptions = {
  strict: false,
  coerce: false,
};

export function asRegEx<T>(search: T, options: AsRegExOptions = defaultAsRegExOptions): RegExp {
  if (search instanceof RegExp) return search;
  // If not coerce, escape all special characters.
  const coerce = typeof options.stringSearch === "boolean" ? options.stringSearch : options.coerce;
  const strict = options.strict;

  if (typeof search === "string" || typeof search === "number") {
    let searchString = `${search}`;
    if (!coerce) searchString = escapeRegex(`${searchString}`);
    if (strict) return new RegExp(`^${searchString}$`, "g");
    return new RegExp(`${searchString}`, "g");
  }
  throw new Error("Invalid search type");
}

function escapeRegex(text: string) {
  /* eslint-disable no-useless-escape */
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}