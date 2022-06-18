import {
  avLayerMethods,
  avLayerProps,
  cameraLayerProps,
  layerBaseMethods,
  layerBaseProps,
  lightLayerProps,
  textLayerProps,
} from "./library/propDictionary";

const layerTypes = [
  "ShapeLayer",
  "TextLayer",
  "CameraLayer",
  "LightLayer",
  "NullLayer",
  "AdjustmentLayer",
  "GuideLayer",
  "PreComp",
  "SolidLayer",
  "PlaceholderLayer",
  "FileLayer",
];

const layerPropLookup = {
  ShapeLayer: [...avLayerProps, ...avLayerProps],
  TextLayer: [...avLayerProps, ...avLayerMethods, ...textLayerProps],
  CameraLayer: [...cameraLayerProps],
  LightLayer: [...lightLayerProps],
  NullLayer: [...avLayerProps, ...avLayerProps],
  AdjustmentLayer: [...avLayerProps, ...avLayerProps],
  GuideLayer: [...avLayerProps, ...avLayerProps],
  PreComp: [...avLayerProps, ...avLayerProps],
  SolidLayer: [...avLayerProps, ...avLayerProps],
  PlaceholderLayer: [...avLayerProps, ...avLayerProps],
  FileLayer: [...avLayerProps, ...avLayerProps],
};

const lookupLayerProps = (layerType) => {
  if (typeof layerType !== "string" && !layerTypes[layerType]) return [];
  return [...layerBaseProps, ...layerBaseMethods, ...layerPropLookup[layerType]];
};

const getLayerType = (layer) => {
  switch (layer.matchName) {
  case "ADBE Vector Layer":
    return "ShapeLayer";
  case "ADBE Text Layer":
    return "TextLayer";
  case "ADBE Camera Layer":
    return "CameraLayer";
  case "ADBE Light Layer":
    return "LightLayer";
  case "ADBE AV Layer":
    if (layer.nullLayer === true) {
      return "NullLayer";
    } else if (layer.adjustmentLayer === true) {
      return "AdjustmentLayer";
    } else if (layer.guideLayer === true) {
      return "GuideLayer";
    } else if (layer.source instanceof CompItem) {
      return "PreComp";
    } else if (layer.source.mainSource instanceof SolidSource) {
      return "SolidLayer";
    } else if (layer.source.mainSource instanceof PlaceholderSource) {
      return "PlaceholderLayer";
    } else if (layer.source.mainSource instanceof FileSource) {
      if (layer.source.footageMissing == true) {
        return "FileLayer";
      } else {
        return "FileLayer";
      }
    }
    break;
  }
};

export { getLayerType, lookupLayerProps, layerTypes, layerPropLookup };
