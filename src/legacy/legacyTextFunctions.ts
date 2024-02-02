import camelCase from "just-camel-case";
// import { status } from "../globals/project/menu";
import { status } from "../globals/project/status";
import { regSafe } from "../tools/ae";
import { project } from "../globals/globals";

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////  TEXT LAYER AND RENDER FUNCS  /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

interface ITextSetOptions {
    textLayer: TextLayer;
    comp: CompItem;
    newText: string;
    fontStyles: { [key: string]: string };
    panel: TabbedPanel;
}

// SET TEXT FUNCTION (THIS FILLS THE TEXT FIELDS WITH NEW TEXT AND ENSURES THAT THEY FIT IN THE ALLOTED SPACE)
// ====
export function setText({
  textLayer,
  comp,
  newText,
  fontStyles,
  panel,
}: ITextSetOptions, debug = false) {
  status.innerText = "setting text: " + regSafe(newText);
  if(debug) {
    project.log("setting text: " + regSafe(newText));
  }

  const layerProp = textLayer.property("Source Text") as Property;
  const layerTextDoc = layerProp.value;
  const boxSize = layerTextDoc.boxText
    ? { width: layerTextDoc.boxTextSize[0], height: layerTextDoc.boxTextSize[1] }
    : undefined;
  const rectSize = layerTextDoc.boxText ? textLayer.sourceRectAtTime(0, false) : undefined;
  let alignment = ["c", "c"];
  // var scale = textLayer.transform.scale.value[0] / 100;
  const fontRatio = layerTextDoc.fontSize / layerTextDoc.leading;

  // const textImAfter = /The Great Dane looked more like a horse than a dog/.test(newText);

  //Check for font styles

  status.innerText = "checking for font styles";
  if (/\(.*\)/.test(textLayer.name)) {
    const styleName = textLayer.name.match(/\(.*\)/)[0].slice(1, -1);

    if (
      fontStyles[camelCase(styleName + " Style")] !== undefined &&
      panel[fontStyles[camelCase(styleName + " Style")]][camelCase(styleName + " Style")].txt.text !== ""
    ) {
      layerTextDoc.font =
        panel[fontStyles[camelCase(styleName + " Style")]][camelCase(styleName + " Style")].txt.text;
    }
  }

  if (newText === "") {
    status.innerText = "Blank - skipping resize";
    layerTextDoc.text = newText;
    layerProp.setValue(layerTextDoc);
    return;
  }
  if (!layerTextDoc.boxText) {
    status.innerText = "No use of point text - skipping resize";
    layerTextDoc.text = newText;
    layerProp.setValue(layerTextDoc);
    return;
  }

  if (layerTextDoc.boxText && boxSize.height < layerTextDoc.leading * 1.75) {
    //==== // ======= // ====//
    //====               ====//
    //==== ONE LINE TEXT ====//
    //====               ====//
    //==== // ======= // ====//

    if(debug) project.log("One line text");

    //Move anchor point and figure out where it is
    alignment = anchorPoint(textLayer, "rect");

    //Set the text to the new text and make the text box so large that it's bound to fit.
    layerTextDoc.text = newText;
    layerTextDoc.boxTextSize = [boxSize.width * 10, boxSize.height];
    layerProp.setValue(layerTextDoc);

    //Move the anchor point to the center or the right since we have a new TextBox size
    if (alignment[1] === "c") {
      textLayer.transform.anchorPoint.setValue([
        textLayer.transform.anchorPoint.value[0] + boxSize.width * 4.5,
        textLayer.transform.anchorPoint.value[1],
      ]);
    } else if (alignment[1] === "r") {
      textLayer.transform.anchorPoint.setValue([
        textLayer.transform.anchorPoint.value[0] + boxSize.width * 9,
        textLayer.transform.anchorPoint.value[1],
      ]);
    }

    //Add the scale expression then resize the box to fit the new text
    textLayer.transform.scale.expression = textExpression(layerTextDoc.fontSize, boxSize.width / comp.width);
    if(debug){ 
      project.log("Expression:");
      project.log(textLayer.transform.scale.expression);
    }

    layerTextDoc.boxTextSize = [
      Math.ceil(
        boxSize.width / (textLayer.transform.scale.value[0] / 100) +
          layerTextDoc.fontSize * (textLayer.transform.scale.value[0] / 100)
      ),
      boxSize.height,
    ];
    layerProp.setValue(layerTextDoc);

    //Move the anchor point to the center or the right since we have a new TextBox size
    if (alignment[1] === "c")
      textLayer.transform.anchorPoint.setValue([
        textLayer.transform.anchorPoint.value[0] - (boxSize.width * 5 - layerTextDoc.boxTextSize[0] / 2),
        textLayer.transform.anchorPoint.value[1],
      ]);
    if (alignment[1] === "r")
      textLayer.transform.anchorPoint.setValue([
        textLayer.transform.anchorPoint.value[0] - (boxSize.width * 10 - layerTextDoc.boxTextSize[0]),
        textLayer.transform.anchorPoint.value[1],
      ]);
  } else {
    status.innerText = "Paragraph text takes longer";

    //==== // ======== // ====//
    //====                ====//
    //==== MULTILINE TEXT ====//
    //====                ====//
    //==== // ======== // ====//

    //Move anchor point and figure out where it is
    alignment = anchorPoint(textLayer, "box");

    //Determine how many lines of text should fit
    const maxLines = Math.floor(layerTextDoc.boxTextSize[1] / layerTextDoc.leading);

    //Set the text to the new text and make the text box so large that it's bound to fit.
    layerTextDoc.text = newText;
    layerTextDoc.boxTextSize = [boxSize.width, boxSize.height * 100];
    layerProp.setValue(layerTextDoc);

    if(debug) project.log("New Text: " + newText);

    if(debug) project.log("Alignment: " + alignment.reducer((a, b) => `${a}, ${b}`));

    if(debug) project.log("Text height: " + textLayer.sourceRectAtTime(0, false).height);
    if(debug) project.log("Text width: " + textLayer.sourceRectAtTime(0, false).width);

    if(debug) project.log("Rect height: " + rectSize.height);

    if(debug) project.log("Max Lines: " + maxLines);
    if(debug) project.log("Lines: " + layerTextDoc.baselineLocs.length / 4);

    if (alignment[0] === "c" && textLayer.sourceRectAtTime(0, false).height < rectSize.height) {
      //Center the text if it's not the full height and the anchor is the center
      const layerPosition = textLayer.position.value;
      const adjust = (rectSize.height - textLayer.sourceRectAtTime(0, false).height) / 2;
      textLayer.position.setValue([layerPosition[0], layerPosition[1] + adjust, layerPosition[2]]);
    } 
    
    // if (layerTextDoc.baselineLocs.length / 4 > maxLines) {
    if (textLayer.sourceRectAtTime(0, false).height > boxSize.height) {
      //Resize if too big for the textbox
      while (textLayer.sourceRectAtTime(0, false).height > boxSize.height) {
        diminish();
      }
    }

    //Resize the textbox to it's original size
    layerTextDoc.boxTextSize = [boxSize.width, boxSize.height];
    layerProp.setValue(layerTextDoc);
  }

  //function to reduce the textsize by one point until it fits
  let count = 0;
  function diminish() {
    if(debug) project.log(`diminish ${count++}`);
    layerTextDoc.fontSize -= 1;
    layerTextDoc.leading = layerTextDoc.fontSize / fontRatio;
    layerProp.setValue(layerTextDoc);
    //layerTextDoc = textLayer.sourceText.value;
  }
}

// EXPRESSION TO USE ON TEXT LAYERS
// ====
function addComment(comment: string) {
  return `// ${comment}`;
}
function textExpression(minTextSize, maxWidth) {
  if (minTextSize === "skip" || maxWidth === "skip") return "";
  return `${addComment("This lets us get the width of the textbox containing your content.")}
layerWidth = thisLayer.sourceRectAtTime(time).width;
layerHeight = thisLayer.sourceRectAtTime(time).height;

${addComment("This lets us get the width of the current composition.")}
compWidth = thisComp.width;

${addComment("we want to set the width to a little over 100%.")}
maximumWidth = compWidth * ${maxWidth};

${addComment("but we don't want it to be too big if it's a short line.")}
maximumHeight = ${minTextSize};
${addComment("Get the ratio.")}
forWidth = maximumWidth / layerWidth * 100;
forHeight = maximumHeight / layerHeight * 100;
percentNeeded = (forWidth > forHeight) ? forHeight : forWidth;
percentNeeded = (percentNeeded < 100) ? percentNeeded : 100;
[percentNeeded, percentNeeded]`;
}

// ANCHOR POINT FUNCTION (FOR USE WITH TEXT, THIS MOVES THE ANCHOR POINT TO A REASONABLE PLACE)
// ====
function anchorPoint(layer, bound) {
  const comp = layer.containingComp;
  const curTime = comp.time;
  const layerAnchor = layer.anchorPoint.value;
  let x;
  let y;
  const cor = ["c", "c"];
  const rect = layer.sourceRectAtTime(curTime, false);

  switch (layer.sourceText.value.justification) {
  case ParagraphJustification.RIGHT_JUSTIFY:
    cor[1] = "r";
    break;
  case ParagraphJustification.LEFT_JUSTIFY:
    cor[1] = "l";
    break;
  case ParagraphJustification.CENTER_JUSTIFY:
  case ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT:
  case ParagraphJustification.FULL_JUSTIFY_LASTLINE_RIGHT:
  case ParagraphJustification.FULL_JUSTIFY_LASTLINE_CENTER:
  case ParagraphJustification.FULL_JUSTIFY_LASTLINE_FULL:
    cor[1] = "c";
    break;
  default:
    cor[1] = "c";
    break;
  }

  if (bound === "box") {
    if (
      layer.anchorPoint.value[1] <=
      layer.sourceText.value.boxTextPos[1] + layer.sourceText.value.boxTextSize[1] / 4
    ) {
      cor[0] = "t";
    } else if (
      layer.anchorPoint.value[1] >=
      layer.sourceText.value.boxTextPos[1] + (3 * layer.sourceText.value.boxTextSize[1]) / 4
    ) {
      cor[0] = "b";
    }

    switch (cor[1]) {
    case "l":
      x = layer.sourceText.value.boxTextPos[0];
      break;
    case "r":
      x = layer.sourceText.value.boxTextSize[0];
      x += layer.sourceText.value.boxTextPos[0];
      break;
    default:
      x = layer.sourceText.value.boxTextSize[0] / 2;
      x += layer.sourceText.value.boxTextPos[0];
      break;
    }

    switch (cor[0]) {
    case "t":
      y = layer.sourceText.value.boxTextPos[1];
      break;
    case "b":
      y = layer.sourceText.value.boxTextSize[1];
      y += layer.sourceText.value.boxTextPos[1];
      break;
    default:
      y = layer.sourceText.value.boxTextSize[1] / 2;
      y += layer.sourceText.value.boxTextPos[1];
      break;
    }
  } else {
    if (layer.anchorPoint.value[1] <= rect.top + rect.height / 4) {
      cor[0] = "t";
    } else if (layer.anchorPoint.value[1] >= rect.top + (3 * rect.height) / 4) {
      cor[0] = "b";
    }

    switch (cor[1]) {
    case "l":
      x = layer.sourceRectAtTime(curTime, false).left;
      break;
    case "r":
      x = layer.sourceRectAtTime(curTime, false).width;
      x += layer.sourceRectAtTime(curTime, false).left;
      break;
    default:
      x = layer.sourceRectAtTime(curTime, false).width / 2;
      x += layer.sourceRectAtTime(curTime, false).left;
      break;
    }

    switch (cor[0]) {
    case "t":
      y = layer.sourceRectAtTime(curTime, false).top;
      break;
    case "b":
      y = layer.sourceRectAtTime(curTime, false).height;
      y += layer.sourceRectAtTime(curTime, false).top;
      break;
    default:
      y = layer.sourceRectAtTime(curTime, false).height / 2;
      y += layer.sourceRectAtTime(curTime, false).top;
      break;
    }
  }

  const xAdd = (x - layerAnchor[0]) * (layer.scale.value[0] / 100);
  const yAdd = (y - layerAnchor[1]) * (layer.scale.value[1] / 100);

  layer.anchorPoint.setValue([x, y]);

  const layerPosition = layer.position.value;

  layer.position.setValue([layerPosition[0] + xAdd, layerPosition[1] + yAdd, layerPosition[2]]);

  return cor;
}
