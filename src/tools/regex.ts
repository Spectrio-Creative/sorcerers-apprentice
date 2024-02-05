export function asRegEx<T>(search: T): RegExp {
  if (search instanceof RegExp) return search;
  if (typeof search === "string" || typeof search === "number") return new RegExp(`${search}`, "g");
  throw new Error("Invalid search type");
}
