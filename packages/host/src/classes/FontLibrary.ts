export class FontLibrary {
  projectFonts: Font[] = [];

  constructor() {
    this.findFonts();
  }

  findFonts() {
    for (let i = 1; i <= app.project.items.length; i++) {
      const item = app.project.items[i];
      if (item instanceof CompItem) {
        for (let ii = 1; ii <= item.layers.length; ii++) {
          const layer = item.layers[ii];
          if (!(layer instanceof TextLayer)) continue;

          const font: Font = {
            font: (layer as TextLayer).text.sourceText.value.font,
            fontFamily: (layer as TextLayer).text.sourceText.value.fontFamily,
            fontStyle: (layer as TextLayer).text.sourceText.value.fontStyle,
          };

          //   If the font is not already in the projectFonts array, add it.
          if (!this.projectFonts.some((projectFont) => projectFont.font === font.font)) {
            this.projectFonts.push(font);
          }
        }
      }
    }
  }

  fontOptions(): string[] {
    return this.projectFonts.map((font) => font.font);
  }

  refresh() {
    this.projectFonts = [];
    this.findFonts();
  }
}
