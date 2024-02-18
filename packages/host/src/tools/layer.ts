export interface AlignAnchorOptions {
  offset?: [number, number];
  rectangle?: Rect;
}

const alignments = {
  center: { x: -0.5, y: -0.5 },
  right: { x: -1, y: 0 },
  left: { x: 0, y: 0 },
  bottom: { x: 0, y: -1 },
  top: { x: 0, y: 0 },
};

export function getLayerDelta(layer: AVLayer, alignment: Alignment, layerRect: Rect) {
  const [alignX, alignY] = alignment;
  const anchorPoint = layer.anchorPoint.value;

  const scale = layer.scale.value.map((s) => s / 100) as [number, number];
  const scaledAnchorPoint = anchorPoint.map((a, i) => a * scale[i]) as [number, number] | [number, number, number];

  const deltaX = (alignments[alignX].x || 0) * layerRect.width + scaledAnchorPoint[0];
  const deltaY = (alignments[alignY].y || 0) * layerRect.height + scaledAnchorPoint[1];

  return [deltaX, deltaY];
}

export function alignAnchorPoint(layer: Layer, alignment: Alignment, options: AlignAnchorOptions = {}) {
  const [alignX, alignY] = alignment;

  if ((layer.anchorPoint.numKeys, layer.position.numKeys)) {
    alert("Cannot align anchor point of layer with anchor point or position keyframes.");
    return;
  }

  const layerType = parseLayerType(layer);
  if (!(layer instanceof TextLayer || layer instanceof AVLayer || layer instanceof ShapeLayer)) {
    alert("Cannot align anchor point of layer type: " + layerType);
    return;
  }

  const childAlignment = options.rectangle ? (["left", "top"] as Alignment) : alignment;

  const layerRect: Rect = getLayerRect(layer as Layer);
  const delta = getLayerDelta(layer, childAlignment, layerRect);
  const scale = layer.scale.value.map((s) => s / 100) as [number, number];

  // If layer is text, adjust delta to account for sourceRect
  if (layer instanceof TextLayer) {
    const rect = layer.sourceRectAtTime(layer.containingComp.time, false);
    delta[0] -= rect.left * scale[0];
    delta[1] -= rect.top * scale[1];
  }

  if (options.rectangle) {
    const rect = options.rectangle;
    delta[0] -= rect.left - layerRect.left;
    delta[0] += (alignments[alignX].x || 0) * rect.width;
    delta[1] -= rect.top - layerRect.top;
    delta[1] += (alignments[alignY].y || 0) * rect.height;
  }

  const anchorPoint = layer.anchorPoint.value;
  const position = layer.position.value;

  const newAnchorPoint = [anchorPoint[0] - delta[0] / scale[0], anchorPoint[1] - delta[1] / scale[1]];
  const newPosition = [position[0] - delta[0], position[1] - delta[1]] as [number, number];

  layer.anchorPoint.setValue(newAnchorPoint as [number, number]);
  layer.position.setValue(newPosition);
}

export function getLayerRect(layer: Layer): Rect {
  if (!(layer instanceof TextLayer || layer instanceof AVLayer || layer instanceof ShapeLayer)) return;

  const comp = layer.containingComp;
  const layerRect = layer.sourceRectAtTime(comp.time, false);
  const anchorPoint = layer.anchorPoint.value;
  const position = layer.position.value;
  const scale = layer.scale.value;

  const bounds = {
    left: position[0] - anchorPoint[0] * (scale[0] / 100),
    top: position[1] - anchorPoint[1] * (scale[1] / 100),
    width: layerRect.width * (scale[0] / 100),
    height: layerRect.height * (scale[1] / 100),
  };

  if (layer instanceof TextLayer) {
    bounds.left = bounds.left + layerRect.left * (scale[0] / 100);
    bounds.top = bounds.top + layerRect.top * (scale[1] / 100);
  }

  return bounds;
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
