export const parseLayerName = (name: string, permissive = false) => {
  const testType = "^!([A-Z])([a-z]*)\\s*";
  const testTag = "\\((.*)\\)";
  const testTab = "\\[(.*)\\]";
  const testStrings = [
    `${testType}\\s*${testTag}\\s*${testTab}`,
    `${testType}\\s*${testTag}`,
    `${testType}(\\s*)${testTab}`,
    `${testType}`,
  ];

  if (permissive) {
    testStrings.push(
      ...[`(\\s*)(\\s*)${testTag}\\s*${testTab}`, `(\\s*)(\\s*)${testTag}`, `(\\s*)(\\s*)(\\s*)${testTab}`]
    );
  }

  let match: RegExpMatchArray | string[] | null = null;
  for (let i = 0; i < testStrings.length; i++) {
    const test = new RegExp(testStrings[i]);
    match = name.match(test);
    if (match) break;
  }

  if (!match && permissive) match = [""];
  if (!match) return;
  // Fill in empty matches
  while (match.length < 5) match.push("");

  const [fullMatch, typeAbbreviation, optionString, tag, tab] = match.map((m) => (m || "").trim());

  const title = name.replace(fullMatch, "").trim();

  const type = fieldTypeMap[typeAbbreviation] || "";

  const options = (optionString || "")
    .split("")
    .map((option) => fieldOptionMap[option])
    .filter((option) => !!option);

  return { type, options, tab, tag, title } as {
    type: FieldType;
    options: FieldOption[];
    title: string;
    tag: string;
    tab: string;
  };
};

export const fieldTypeMap: { [key: string]: FieldType } = {
  T: "Text",
  A: "Audio",
  I: "Media",
  V: "Media",
  M: "Media",
  C: "Color",
  G: "Group",
  F: "Font",
};

export const fieldOptionMap: { [key: string]: FieldOption } = {
  v: "visible",
  b: "background-size",
  f: "fill-size",
  n: "no-scale",
  s: "scale-down",
  l: "linked-subtag",
};
