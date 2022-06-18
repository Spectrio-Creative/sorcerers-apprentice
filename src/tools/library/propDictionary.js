const layerBaseProps = [
  ...["autoOrient", "comment", "containingComp", "hasVideo", "id", "index", "inPoint"],
  ...["isNameSet", "label", "locked", "marker", "nullLayer", "outPoint", "parent"],
  ...["selectedProperties", "shy", "solo", "startTime", "stretch", "time"],
];

const layerBaseMethods = [
  ...["activeAtTime", "applyPreset", "copyToComp", "doSceneEditDetection", "duplicate"],
  ...["moveAfter", "moveBefore", "moveToBeginning", "moveToEnd", "remove", "setParentWithJump"],
];

const layerCollectionMethods = [
  ...["add", "addBoxText", "addCamera", "addLight", "addNull", "addShape", "addSolid", "addText"],
  ...["byName", "precompose"],
];

const avLayerProps = [
  ...["adjustmentLayer", "audioActive", "audioEnabled", "blendingMode"],
  ...["canSetCollapseTransformation", "canSetTimeRemapEnabled", "collapseTransformation"],
  ...["effectsActive", "environmentLayer", "frameBlending", "frameBlendingType", "guideLayer"],
  ...["hasAudio", "hasTrackMatte", "height", "isNameFromSource", "isTrackMatte"],
  ...["motionBlur", "preserveTransparency", "quality", "samplingQuality", "source", "threeDLayer"],
  ...["threeDPerChar", "timeRemapEnabled", "trackMatteType", "width"],
];

const possibleAVLayerProps = [
  ...["marker", "timeRemap", "motionTrackers", "masks", "effects", "transform", "layerStyles"],
  ...["geometryOptions", "materialOptions", "audio"],
];

const possibleAVLayerPropChildren = {
  transform: [
    ...["anchorPoint", "position", "scale", "orientation", "xRotation", "yRotation"],
    ...["rotation", "opacity"],
  ],
  materialOptions: [
    ...["castsShadows", "lightTransmission", "acceptsShadows", "acceptsLights"],
    ...["appearsInReflections", "ambient", "diffuse", "specularIntensity", "specularShininess"],
    ...["metal", "reflectionIntensity", "reflectionSharpness", "reflectionRolloff", "transparency"],
    ...["transparencyRolloff", "indexofRefraction"],
  ],
  audio: ["audioLevels"],
};

const avLayerMethods = [
  ...["addToMotionGraphicsTemplate", "addToMotionGraphicsTemplateAs", "audioActiveAtTime"],
  ...["calculateTransformFromPoints", "canAddToMotionGraphicsTemplate", "compPointToSource"],
  ...["openInViewer", "replaceSource", "sourcePointToComp", "sourceRectAtTime"],
];

const cameraLayerProps = ["marker", "transform", "cameraOptions"];

const cameraLayerPropChildren = {
  transform: [
    ...["pointofInterest", "position", "scale", "orientation", "xRotation", "yRotation"],
    ...["rotation", "opacity"],
  ],
  cameraOptions: ["zoom", "depthofField", "focusDistance", "blurLevel"],
};

const lightLayerProps = ["marker", "transform", "cameraOptions", "lightType"];

const lightLayerPropChildren = {
  transform: [
    ...["pointofInterest", "position", "scale", "orientation", "xRotation", "yRotation"],
    ...["rotation", "opacity"],
  ],
  cameraOptions: ["zoom", "depthofField", "focusDistance", "blurLevel"],
};

const textLayerProps = [
  ...["text", "sourceText", "pathOptions", "path", "reversePath", "perpendicularToPath"],
  ...["forceAlignment", "firstMargin", "lastMargin", "moreOptions", "anchorPointGrouping"],
  ...["groupingAlignment", "fill", "stroke", "interCharacterBlending", "animators"],
];

export {
  layerBaseProps,
  layerBaseMethods,
  layerCollectionMethods,
  avLayerProps,
  possibleAVLayerProps,
  possibleAVLayerPropChildren,
  avLayerMethods,
  cameraLayerProps,
  cameraLayerPropChildren,
  lightLayerProps,
  lightLayerPropChildren,
  textLayerProps,
};
