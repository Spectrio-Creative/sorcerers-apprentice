import { alignAnchorPoint } from "../../../tools/layer";
import { FieldBase } from "../field/Field";
import { LayerBase } from "./LayerBase";

export class LayerText extends LayerBase {
  textLayer: TextLayer;
  textProperty: TextDocumentProperty;
  textDocument: TextDocument;
  boxSize: Rect;
  rectAtTime: Rect;
  fontRatio: number;

  constructor(layer: Layer, field: FieldBase, layerType?: LayerType) {
    super(layer, field, layerType);
    this.textLayer = layer as TextLayer;
    this.textProperty = this.textLayer.sourceText;
    this.textDocument = this.textProperty.value as TextDocument;
    alignAnchorPoint(this.layer, this.getAnchorAlignment());
    this.rectAtTime = this.textLayer.sourceRectAtTime(this.comp.time, false);
    this.convertToBoxText();
    this.boxSize = this.getBoxSize();

    this.fontRatio = this.textDocument.fontSize / this.textDocument.leading;
  }

  getBoxSize(): Rect {
    const [width, height] = this.textDocument.boxTextSize;
    const [left, top] = this.textDocument.boxTextPos;

    return {
      top,
      left,
      width,
      height,
    };
  }

  isOverset() {
    //
  }

  convertToBoxText() {
    if (this.textDocument.boxText) return;

    const comp = this.comp;
    const pointTextRect = this.textLayer.sourceRectAtTime(comp.time, false);

    const boxText = comp.layers.addBoxText([pointTextRect.width + 10, pointTextRect.height], this.textDocument);
    boxText.moveAfter(this.layer);
    boxText.name = this.textLayer.name;

    const boxRect = {
      left: boxText.sourceText.value.boxTextPos[0],
      top: boxText.sourceText.value.boxTextPos[1],
      width: boxText.sourceText.value.boxTextSize[0],
      height: boxText.sourceText.value.boxTextSize[1],
    };

    const boxProperty = boxText.sourceText;
    const boxDocument = boxProperty.value;

    boxDocument.justification = this.textDocument.justification;
    boxProperty.setValue(boxDocument);

    alignAnchorPoint(boxText as Layer, this.getAnchorAlignment(), { rectagle: boxRect });

    boxText.position.setValue(this.textLayer.position.value);

    this.textLayer.remove();
    this.textLayer = boxText;
    this.layer = boxText as Layer;
    this.textProperty = this.textLayer.sourceText;
    this.textDocument = this.textProperty.value as TextDocument;
  }

  getTextAlignment() {
    return this.textDocument.justification;
  }

  getAnchorAlignment() {
    const justification = this.getTextAlignment();
    const alignment: Alignment = ["center", "center"];

    if (justification === ParagraphJustification.LEFT_JUSTIFY) alignment[0] = "left";
    if (justification === ParagraphJustification.RIGHT_JUSTIFY) alignment[0] = "right";
    if (justification === ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT) alignment[0] = "left";
    if (justification === ParagraphJustification.FULL_JUSTIFY_LASTLINE_RIGHT) alignment[0] = "right";

    return alignment;
  }

  setValue(value: string) {
    // If no change, do nothing.
    if (this.textDocument.text === value) return;

    this.textDocument.text = value;
    this.textProperty.setValue(this.textDocument);
    if (this.isSingleLineText()) this.resizeSingleLine();
    else this.resizeMultiLine();
    this.textProperty.setValue(this.textDocument);
  }

  setFont(value: string) {
    this.textDocument.font = value;
    this.textProperty.setValue(this.textDocument);
  }

  isSingleLineText() {
    // If the height is less than 2 * the leading, then it is considered single line text
    return this.textDocument.leading * 2 <= this.boxSize.height;
  }

  reduceText() {
    this.textDocument.fontSize -= 1;
    this.textDocument.leading = this.textDocument.fontSize / this.fontRatio;
    this.textProperty.setValue(this.textDocument);
  }

  resizeMultiLine() {
    // Determine how many lines of text should fit
    const maxLines = Math.floor(this.textDocument.boxTextSize[1] / this.textDocument.leading);

    // Set the text to the new text and make the text box so large that it's bound to fit.
    this.textDocument.boxTextSize = [this.boxSize.width, this.boxSize.height * 100];
    this.textProperty.setValue(this.textDocument);

    const alignment = this.getAnchorAlignment();

    if (
      alignment[0] === "center" &&
      this.textLayer.sourceRectAtTime(this.comp.time, false).height < this.rectAtTime.height
    ) {
      // Center the text if it's not the full height and the anchor is the center
      const layerPosition = this.textLayer.position.value;
      const adjust = (this.rectAtTime.height - this.textLayer.sourceRectAtTime(this.comp.time, false).height) / 2;
      this.textLayer.position.setValue([layerPosition[0], layerPosition[1] + adjust, layerPosition[2]]);
    } else if (this.textDocument.baselineLocs.length / 4 > maxLines) {
      // Resize if too big for the textbox
      while (this.textLayer.sourceRectAtTime(0, false).height > this.boxSize.height) {
        this.reduceText();
      }
    }

    // Resize the textbox to it's original size
    this.textDocument.boxTextSize = [this.boxSize.width, this.boxSize.height];
    this.textProperty.setValue(this.textDocument);
  }

  resizeSingleLine() {
    this.textDocument.boxTextSize = [this.boxSize.width * 100, this.boxSize.height];
    this.textProperty.setValue(this.textDocument);

    const textBox = this.textLayer.sourceRectAtTime(this.comp.time, false);

    const percent = this.boxSize.width / textBox.width;

    if (percent > 1) {
      // Don't increase font-size
      this.textDocument.boxTextSize = [this.boxSize.width, this.boxSize.height];
      this.textProperty.setValue(this.textDocument);
      return;
    }

    this.textDocument.fontSize = this.textDocument.fontSize * percent;
    this.textDocument.boxTextSize = [this.boxSize.width, this.boxSize.height];
    this.textProperty.setValue(this.textDocument);
  }

  addExpression(minTextSize?: number, maxWidth?: number) {
    if (typeof minTextSize !== "number" || typeof maxWidth !== "number") return "";

    this.textDocument.boxTextSize = [this.boxSize.width * 100, this.boxSize.height];
    this.textProperty.setValue(this.textDocument);

    const expression = `
    // This lets us get the width of the textbox containing your content.
    layerWidth = thisLayer.sourceRectAtTime(time).width;
    layerHeight = thisLayer.sourceRectAtTime(time).height;
    
    // This lets us get the width of the current composition.
    compWidth = thisComp.width;
    
    // we want to set the width to a little over 100%;
    maximumWidth = compWidth * ${maxWidth};
    
    // but we don't want it to be too big if it's a short line
    maximumHeight = ${minTextSize};

    // Get the ratio
    forWidth = maximumWidth / layerWidth * 100;
    forHeight = maximumHeight / layerHeight * 100;
    percentNeeded = (forWidth > forHeight) ? forHeight : forWidth;
    percentNeeded = (percentNeeded < 100) ? percentNeeded : 100;
    [percentNeeded, percentNeeded]
    `;

    this.layer.transform.scale.expression = expression;

    this.textDocument.boxTextSize = [this.boxSize.width, this.boxSize.height];
    this.textProperty.setValue(this.textDocument);

    alignAnchorPoint(this.layer, ["left", "center"]);
  }
}
