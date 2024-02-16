export interface AlignAnchorOptions {
    offset?: [number, number];
    rectagle?: Rect;
}

export function alignAnchorPoint(layer: Layer, alignment: Alignment, options: AlignAnchorOptions = {}) {
  const [alignX, alignY] = alignment;

  if ((layer.anchorPoint.numKeys, layer.position.numKeys)) {
    alert("Cannot align anchor point of layer with anchor point or position keyframes.");
    return;
  }

  const comp = layer.containingComp;
  const layerType = parseLayerType(layer);

  if (!(layer instanceof TextLayer || layer instanceof AVLayer || layer instanceof ShapeLayer)) {
    alert("Cannot align anchor point of layer type: " + layerType);
    return;
  }

  const layerRect: Rect = options.rectagle || layer.sourceRectAtTime(comp.time, false);

  const anchorPoint = layer.anchorPoint.value;
  const position = layer.position.value;

  const totalWidth = layerRect.width + anchorPoint[0];
  const totalHeight = layerRect.height + anchorPoint[1];

  let deltaX = 0;

  if (alignX === "center") deltaX = totalWidth / 2 + layerRect.left;
  if (alignX === "right") deltaX = totalWidth + layerRect.left;
  if (alignX === "left") deltaX = layerRect.left;

  let deltaY = 0;

  if (alignY === "center") deltaY = totalHeight / 2 + layerRect.top;
  if (alignY === "bottom") deltaY = totalHeight + layerRect.top;
  if (alignY === "top") deltaY = layerRect.top;

  //   const newAnchorPoint = [anchorPoint[0] - deltaX, anchorPoint[1] - deltaY, anchorPoint[2]] as [number, number, number];
  //   const newPosition = [position[0] - deltaX, position[1] - deltaY, position[2]] as [number, number, number];
  const newAnchorPoint = [anchorPoint[0] + deltaX, anchorPoint[1] + deltaY] as [number, number];
  const newPosition = [position[0] + deltaX, position[1] + deltaY] as [number, number];

  layer.anchorPoint.setValue(newAnchorPoint);
  layer.position.setValue(newPosition);
}

export function parseLayerType(layer: Layer): LayerType {
  // from https://gist.github.com/zlovatt/bbb10f88d23c1500754caf9388abdf6c
  switch (layer.matchName) {
    case "ADBE Vector Layer":
      return layer.matchName;
    case "ADBE Text Layer":
      return layer.matchName;
    case "ADBE Camera Layer":
      return layer.matchName;
    case "ADBE Light Layer":
      return layer.matchName;
    case "ADBE AV Layer":
      if (layer.nullLayer === true) {
        return "Null";
      } else if ((layer as AVLayer).adjustmentLayer === true) {
        return "Adjustment";
      } else if ((layer as AVLayer).guideLayer === true) {
        return "Guide";
      } else if ((layer as AVLayer).source instanceof CompItem) {
        return "Precomp";
      } else if ((layer as AVLayer).source.mainSource instanceof SolidSource) {
        return "Solid";
      } else if ((layer as AVLayer).source.mainSource instanceof PlaceholderSource) {
        return "Placeholder";
      } else if ((layer as AVLayer).source.mainSource instanceof FileSource) {
        if ((layer as AVLayer).source.footageMissing == true) {
          return "Missing Footage";
        }

        // The following code doesn't make sense. Because it sets the layer
        // to enabled, then 'importIsData' is always false. This is a bug.

        // var priorLayerState = layer.enabled;
        // layer.enabled = true;
        // var importIsData = layer.enabled === false;
        // layer.enabled = priorLayerState;

        // if (importIsData) {
        //   return "Data";
        // }

        if (!(layer as AVLayer).source.hasVideo && (layer as AVLayer).source.hasAudio) {
          return "Audio";
        }

        return "Image";
      }

      return "Invalid";
  }
}
