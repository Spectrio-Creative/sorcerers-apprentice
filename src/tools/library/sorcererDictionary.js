const templateLayerTypes = {
  "!T": "Text",
  "!I": "Image",
  "!V": "Video",
  "!C": "Color",
  "!G": "Group",
  "!F": "Font",
  "!A": "Audio",
};

const parseTemplateTitle = (title) => {
  const layerTitleReg = /^(![A-Z])([a-z]*) *(:?\(([\w ]+)\))? *(:?\[([\w ]+)\])?/i;
  if (!layerTitleReg.test(title)) return;
  
  const match = title.match(layerTitleReg);
  const id = match[1];
  const type = templateLayerTypes[match[1]];
  const tags = (match[2] ? match[2] : "").split("");
  const font = match[4];
  const menuGroup = match[6];

  const cleanName = title.replace(layerTitleReg, "").trim();

  return { id, type, tags, font, menuGroup, title: cleanName };
};


const templateTabReg = /^t(.*)_([0-9]+)$/;
const parseTabTitle = (title) => {
  if(!title) return;

  if(title.input && title.title) return title;
  if(typeof title === "string") {
    if(!templateTabReg.test(title)) return {input: title, title};
    const parsedTitle = title.match(templateTabReg);
    const pt = {
      input: parsedTitle.input,
      title: parsedTitle[1],
      id: parsedTitle[2]
    };
    return pt;
  }
};

export { templateLayerTypes, parseTemplateTitle, templateTabReg, parseTabTitle };
