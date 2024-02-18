import { searchLibrary } from "./project";

export const GoodBoyNinjaColorPicker = (startValue: RGB | RGBA = [1, 1, 1, 1]): RGBA => {
  startValue = [startValue[0], startValue[1], startValue[2], startValue[3] || 1];
  // find the active comp
  let comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    // find a comp to open
    comp = searchLibrary(/.*/g, { type: "Composition", recursive: true, maxResult: 1 })[0];
  }

  if (!comp || !(comp instanceof CompItem)) {
    alert("Please open a comp first");
    return startValue;
  }

  comp.openInViewer();

  // add a temp null;
  const newNull = comp.layers.addNull();
  const newColorControl = (newNull("ADBE Effect Parade") as PropertyGroup).addProperty(
    "ADBE Color Control"
  ) as PropertyGroup;
  const theColorProp = newColorControl("ADBE Color Control-0001") as Property;

  // shy and turn eyeball off
  newNull.shy = true;
  newNull.enabled = false;
  newNull.name = "tempColorPicker";

  // set the value given by the function arguments
  theColorProp.setValue(startValue);

  // prepare to execute
  const editValueID = 2240; // or app.findMenuCommandId("Edit Value...");
  theColorProp.selected = true;
  app.executeCommand(editValueID);

  // harvest the result
  const result = theColorProp.value;

  // remove the null
  if (newNull) {
    newNull.remove();
  }

  return result;

  // if the user click cancel, the function will return the start value but as RGBA. In that case, return null
  // const startValueInRgba = [startValue[0], startValue[1], startValue[2], startValue[3] || 1];

  // return result.toString() == startValueInRgba.toString() ? null : result;
};
