import strip from "strip-comments";

function removeMultiLineSpaces(code) {
  return code.replace(/\n\s*\n/g, "\n");
  // // Allow two newlines, but no more
  // return code.replace(/(?:\n\s*){2,}\n/g, "\n\n");
}

// strip.js
export default function stripComments() {
  return {
    name: "remove-comments", // this name will show up in logs and errors
    transform(code, _id) {

      return {
        code: removeMultiLineSpaces(strip(code)),
        map: null,
      };
    },
  };
}
