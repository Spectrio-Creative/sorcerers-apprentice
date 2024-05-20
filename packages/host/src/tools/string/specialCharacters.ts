export function sanitizeString(str: string) {
  const string = str;
  //   TODO: test convertToSuperscript/convertFromSuperscript function and create convertToSubscript/convertFromSubscript function
  //   string = convertFromSuperscript(string);

  //   const test = convertFromSuperscript("¹");
  //   alert(test);

  return (
    string
      // TODO: Move this to a 'sanitize' function
      .replace(/\t/g, "{{TAB}}")
      .replace(/\u2022/g, "{{BULLET}}")
      .replace(/\u2023/g, "{{BULLET_TRIANGLE}}")
      .replace(/\u25E6/g, "{{BULLET_WHITE}}")
      .replace(/\u2043/g, "{{BULLET_HYPHEN}}")
      .replace(/\u2219/g, "{{BULLET_OPERATOR}}")
      .replace(/\r\n/g, "{{CRLF}}")
      .replace(/\n/g, "{{NEWLINE}}")
      .replace(/\r/g, "{{RETURN}}")
      // replace all non-printable characters
      .replace(/[^\x20-\x7E]/g, "{{NON-PRINTABLE}}")
      // replace all non-ascii characters
      .replace(/[^\x00-\x7F]/g, "{{NON-ASCII}}")
  );
}

function decodeBase(str: string) {
  return str
    .replace(/{{TAB}}/g, "\t")
    .replace(/{{CRLF}}/g, "\r\n")
    .replace(/{{NEWLINE}}/g, "\n")
    .replace(/{{RETURN}}/g, "\r");
}

function decodeBullets(str: string) {
  return str
    .replace(/{{BULLET}}/g, "•")
    .replace(/{{BULLET_TRIANGLE}}/g, "‣")
    .replace(/{{BULLET_WHITE}}/g, "◦")
    .replace(/{{BULLET_HYPHEN}}/g, "⁃")
    .replace(/{{BULLET_OPERATOR}}/g, "∙");
}

function convertToSuperscript(str: string) {
  // Convert string to unicode superscript
  return str.replace(/\^([0-9]+)\^/g, (match, p1) => {
    return p1
      .split("")
      .map((num) => {
        return String.fromCharCode(parseInt(num) + 8304);
      })
      .join("");
  });
}

// function convertFromSuperscript(str: string) {
//   // Convert unicode superscript to string surrounded by '^'
//   return str.replace(/[\u2070-\u209F]+/g, (match) => {
//     return `^${match
//       .split("")
//       .map((char) => {
//         return char.charCodeAt(0) - 8304;
//       })
//       .join("")}^`;
//   });
// }

function escapeNonPrintable(str: string) {
  return str.replace(/{{NON-PRINTABLE}}/g, "").replace(/{{NON-ASCII}}/g, "");
}

export function unsanitizeString(str: string) {
  let string = decodeBase(str);
  string = decodeBullets(string);
  string = convertToSuperscript(string);
  string = escapeNonPrintable(string);

  return string;
}
