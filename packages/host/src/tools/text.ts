export function isTextOverset(textDocument: TextDocument) {
  const aeVersion = Number((app.version.match(/^[0-9]+\.[0-9]+/) || [0])[0]);
  // @ts-ignore
  if (aeVersion >= 24.3) return textDocument.boxOverflow;

  
}
