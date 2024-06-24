export type ExcludableProperties =
  | "position"
  | "scale"
  | "rotation"
  | "opacity"
  | "anchorPoint"
  | "masks"
  | "effects"
  | "inPoint"
  | "outPoint";

export function copyProperties(
  sourceLayer: Layer,
  targetLayer: Layer,
  excludedProperties: ExcludableProperties[] = []
) {
  function copyProperty(sourceProp, targetProp) {
    if (sourceProp.numProperties) {
      // Recursively copy properties if the property has sub-properties
      for (let i = 1; i <= sourceProp.numProperties; i++) {
        const sourceSubProp = sourceProp.property(i);
        const targetSubProp = targetProp.property(i);
        if (targetSubProp) {
          copyProperty(sourceSubProp, targetSubProp);
        }
      }
    } else {
      if (sourceProp.isTimeVarying) {
        // Clear any existing keyframes on the target property
        while (targetProp.numKeys > 0) {
          targetProp.removeKey(1);
        }

        // Copy each keyframe
        for (let k = 1; k <= sourceProp.numKeys; k++) {
          const time = sourceProp.keyTime(k);
          const value = sourceProp.keyValue(k);
          targetProp.setValueAtTime(time, value);

          // Copy keyframe interpolation
          const easeIn = sourceProp.keyInTemporalEase(k);
          const easeOut = sourceProp.keyOutTemporalEase(k);
          const interpTypeIn = sourceProp.keyInInterpolationType(k);
          const interpTypeOut = sourceProp.keyOutInterpolationType(k);
          targetProp.setTemporalEaseAtKey(k, easeIn, easeOut);
          targetProp.setInterpolationTypeAtKey(k, interpTypeIn, interpTypeOut);
        }
      } else {
        // If not time-varying, just copy the static value
        targetProp.setValue(sourceProp.value);
      }
    }
  }

  // Copy Transform Properties
  const sourceTf = sourceLayer.transform;
  const targetTf = targetLayer.transform;
  if (!excludedProperties.includes("position")) copyProperty(sourceTf.position, targetTf.position);
  if (!excludedProperties.includes("scale")) copyProperty(sourceTf.scale, targetTf.scale);
  if (!excludedProperties.includes("rotation")) copyProperty(sourceTf.rotation, targetTf.rotation);
  if (!excludedProperties.includes("opacity")) copyProperty(sourceTf.opacity, targetTf.opacity);
  if (!excludedProperties.includes("anchorPoint")) copyProperty(sourceTf.anchorPoint, targetTf.anchorPoint);

  // Copy Masks
  const sourceMasks = sourceLayer.property("ADBE Mask Parade") as PropertyGroup;
  const targetMasks = targetLayer.property("ADBE Mask Parade") as PropertyGroup;
  for (let m = 1; m <= sourceMasks.numProperties; m++) {
    if (excludedProperties.includes("masks")) continue;
    const sourceMask = sourceMasks.property(m);
    const targetMask = targetMasks.addProperty("Mask");

    // Copy mask shape keyframes and other properties
    copyProperty(sourceMask.property("ADBE Mask Shape"), targetMask.property("ADBE Mask Shape"));
    copyProperty(sourceMask.property("ADBE Mask Feather"), targetMask.property("ADBE Mask Feather"));
    copyProperty(sourceMask.property("ADBE Mask Opacity"), targetMask.property("ADBE Mask Opacity"));
    copyProperty(sourceMask.property("ADBE Mask Offset"), targetMask.property("ADBE Mask Offset"));

    // Copy mask mode
    if (sourceMask.property("ADBE Mask Mode") as Property)
      (targetMask.property("ADBE Mask Mode") as Property).setValue(
        (sourceMask.property("ADBE Mask Mode") as Property).value
      );
  }

  // Copy Effects
  const sourceEffects = sourceLayer.property("ADBE Effect Parade") as PropertyGroup;
  const targetEffects = targetLayer.property("ADBE Effect Parade") as PropertyGroup;
  for (let e = 1; e <= sourceEffects.numProperties; e++) {
    if (excludedProperties.includes("effects")) continue;
    const sourceEffect = sourceEffects.property(e);
    const targetEffect = targetEffects.addProperty(sourceEffect.matchName);

    // Recursively copy each property of the effect
    copyProperty(sourceEffect, targetEffect);
  }

  // Copy InPoint and OutPoint
  if (!excludedProperties.includes("inPoint")) targetLayer.inPoint = sourceLayer.inPoint;
  if (!excludedProperties.includes("outPoint")) targetLayer.outPoint = sourceLayer.outPoint;
}
