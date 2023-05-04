import { outFolder, status, template } from "../globals/project/menu";
import { allEditableLayers } from "../globals/legacySupport";
import { hexToRgb } from "../tools/colors";
import { locateOrLoadFile } from "../tools/fs";
import { findLayers, libItemsInFolder, regSafe } from "../tools/ae";
import { customEach } from "../tools/legacyTools";
import { RenderOp } from "../classes/Renderer";

// PREREQUISITE CHECKS
// ====
export function prerequisites(templateName, imageList) {
  status.text = "Checking Prerequisites";
  status.text = "Checking for images";

  const editableLayers = allEditableLayers[templateName.name];

  for (let z = 0; z < editableLayers.length; z++) {
    const layer = editableLayers[z];
    if (/^!T[a-z]*/g.test(layer.name) && layer.position.numKeys > 0) {
      alert(
        `Layer Setup Error:\n
The text layer "${layer.name}" contains position keyframes. These unfortunately mess with the script's ability to resize text. Please remove the keyframes. Maybe try adding them to a parent null layer instead!`
      );
      return -1;
    }
    if ((/^!I[a-z]*/g.test(layer.name) || /^!V[a-z]*/g.test(layer.name)) && layer.scale.numKeys > 0) {
      alert(
        `Layer Setup Warning:\n
The image layer "${layer.name}" contains scale keyframes. These will be overwritten when the script is resizing the image. To avoid any problems that might result, try adding them to a parent null layer instead!`
      );
    }
  }

  // var templateChildren = imageList.children;

  const templateChildren = template[templateName.name]["content_" + templateName.text].children;
  for (let i = 0; i < templateChildren.length; i++) {
    const childChildren = templateChildren[i].children;

    for (let u = 0; u < childChildren.length; u++) {
      if (childChildren[u].text === "Visible") continue;

      const layerRef = imageList[templateChildren[i].name][childChildren[u].name];

      if (layerRef.media !== undefined) {
        if (imagePreparation(layerRef.media, "media file") === -1) return -1;
      } else if (layerRef.audio !== undefined) {
        if (imagePreparation(layerRef.audio, "audio file") === -1) return -1;
      } else if (layerRef.color !== undefined) {
        if (colorCheck(layerRef.txt.text) !== -1) {
          layerRef.txt.text = colorCheck(layerRef.txt.text);
        } else {
          return -1;
        }
      }
    }
  }

  return;

  function colorCheck(colour) {
    if (colour === "" || /^#{0,1}[0-9a-fA-F]{3,6} *$|[0-9]+, *[0-9]+, *[0-9]+ */g.test(colour)) {
      if (/^#{0,1}[0-9a-fA-F]{3,6} *$/.test(colour)) {
        const newColor = hexToRgb(/#/.test(colour) ? colour : "#" + colour);
        return newColor.r + ", " + newColor.g + ", " + newColor.b;
      } else {
        return colour;
      }
    } else {
      alert("'" + colour + "' not a valid color");
      return -1;
    }
  }

  function imagePreparation(imgT, fileT) {
    status.text = "Checking: " + imgT.text;
    const fileName = locateOrLoadFile(imgT.text);
    if (!fileName) {
      alert(`Could not find ${fileT} '${imgT.text}'`);
      return -1;
    }

    imgT.text = fileName;
  }
}

export function addLinkedPrecomps(folderName, newFolder, composition) {
  status.text = "looking for original precomp folder";
  const ORprecomps = libItemsInFolder(/Precomps/g, folderName, "Folder")[0];
  if (ORprecomps == undefined) return;
  const newPrecomps = [];
  status.text = "found original precomp folder";
  const precompFolder = newFolder.items.addFolder(ORprecomps.name);
  status.text = "made new precomp folder";

  function copyPrecompFolder(oldLocation, newLocation) {
    for (let i = 1; i <= oldLocation.items.length; i++) {
      status.text = "looking for compositions " + i;
      if (oldLocation.items[i].typeName === "Composition") {
        const newComp = oldLocation.items[i].duplicate();
        newComp.name = oldLocation.items[i].name;
        newComp.parentFolder = newLocation;
        newPrecomps.push(newComp);
        const replaceLayer1 = findLayers(regSafe(">> " + newComp.name + " <<"), composition);

        if (replaceLayer1.length == 0) continue;
        customEach(replaceLayer1, function (layerRep) {
          layerRep.replaceSource(newComp, false);
        });
      } else if (oldLocation.items[i].typeName === "Folder") {
        const newFolder = newLocation.items.addFolder(oldLocation.items[i].name);
        copyPrecompFolder(oldLocation.items[i], newFolder);
      }
    }
  }

  copyPrecompFolder(ORprecomps, precompFolder);

  for (let z = 0; z < newPrecomps.length; z++) {
    status.text = "pre precomps " + z;

    for (let u = 0; u < newPrecomps.length; u++) {
      let replaceCount = 1;
      if (u === z) continue;
      const replaceLayer = findLayers(regSafe(">> " + newPrecomps[u].name + " <<"), newPrecomps[z]);
      status.text = "checking for " + newPrecomps[u].name + " in " + newPrecomps[z].name;

      if (replaceLayer.length == 0) continue;
      customEach(replaceLayer, function (preLayerRep) {
        preLayerRep.replaceSource(newPrecomps[u], false);
        status.text = "replaced " + replaceCount + " " + newPrecomps[u].name + " precomp";
        replaceCount++;
      });
    }
  }

  status.text = "precomps all linked";
  return;
}

export function sendtoRender(composition: CompItem, renderOp: RenderOp, outFile?: string) {
  if (renderOp === "compOnly") return; //skip all this

  //var nameOfFile = outFolder.txt//(fileName.txt.text === '') ? composition.name : fileName.txt.text;

  const resultFile = new File(outFile || outFolder.txt.text); // + slash + nameOfFile);
  const renderQueue = app.project.renderQueue;
  const render = renderQueue.items.add(composition);
  render.outputModules[1].file = resultFile;

  if (renderOp === "aeQueueOnly") return;

  // Scripting support for Queue in AME.
  // Requires Adobe Media Encoder 11.0.
  {
    if (app.project.renderQueue.canQueueInAME == true) {
      // Send queued items to AME, but do not start rendering.
      //app.project.renderQueue.queueInAME(true);
      app.project.renderQueue.queueInAME(renderOp === "queueOnly" ? false : true);
    } else {
      alert("There are no queued items in the Render Queue.");
    }
  }
}

// EXPRESSION TO USE ON IMAGE LAYERS
// ====
export function imgExpression(ratio, contain) {
  if (ratio === undefined) ratio = 1;
  if (ratio === "skip") return "";
  if (contain === "height" || contain === "width")
    return (
      "// This lets us get the " +
      contain +
      " of the image containing your content.\
layerSize = thisLayer.sourceRectAtTime(time)." +
      contain +
      ";\
\
// This lets us get the width of the current composition.\
compSize = thisComp." +
      contain +
      ";\
\
// we want to set the " +
      contain +
      " to a little over 100%;\
maximumSize = compSize * " +
      ratio +
      ";\
\
// Get the ratio\
percentNeeded = maximumSize / layerSize * 100;\
[percentNeeded, percentNeeded]"
    );
  return (
    "// Get layer info.\
layerWidth = thisLayer.sourceRectAtTime(time).width;\
layerHeight = thisLayer.sourceRectAtTime(time).height;\
layerRatio = layerWidth / layerHeight;\
// Get comp info.\
compWidth = thisComp.width;\
compHeight = thisComp.height;\
compRatio = compWidth / compHeight;\
// If the layer ratio is smaller the width is at play\
compNum = compHeight;\
layerNum = layerHeight;\
if(layerRatio <= compRatio) {\
  compNum = compWidth;\
  layerNum = layerWidth;\
}\
\
maximumNum = compNum * " +
    ratio +
    ";\
// Get the ratio\
percentNeeded = maximumNum / layerNum * 100;\
[percentNeeded, percentNeeded]"
  );
}
