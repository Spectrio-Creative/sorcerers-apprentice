import { log } from "./system";

export interface AlignAnchorAlerts {
  keyframes?: boolean | string;
  layerType?: boolean | string;
}

export interface AlignAnchorAlertsDefault {
  keyframes: false | string;
  layerType: false | string;
}

export interface AlignAnchorOptions {
  offset?: [number, number];
  rectangle?: Rect;
  alerts?: boolean | AlignAnchorAlerts;
}

const alignments = {
  center: { x: -0.5, y: -0.5 },
  right: { x: -1, y: 0 },
  left: { x: 0, y: 0 },
  bottom: { x: 0, y: -1 },
  top: { x: 0, y: 0 },
};

function setDefaultAlerts(
  alerts: boolean | AlignAnchorAlerts,
  layer: { layerType: LayerType; layerName: string }
): false | AlignAnchorAlertsDefault {
  if (!alerts) return false;

  const keyframesMessage = `Cannot align anchor point of layer ${layer.layerName} because of anchor point or position keyframes.`;
  const layerTypeMessage = `Cannot align anchor point of layer ${layer.layerName} with type: ${layer.layerType}`;

  if (typeof alerts === "boolean") {
    return {
      keyframes: keyframesMessage,
      layerType: layerTypeMessage,
    };
  }

  if (typeof alerts.keyframes === "undefined") alerts.keyframes = false;
  if (typeof alerts.layerType === "undefined") alerts.layerType = false;

  if (typeof alerts.keyframes === "boolean" && alerts.keyframes) {
    alerts.keyframes = keyframesMessage;
  }

  if (typeof alerts.layerType === "boolean" && alerts.layerType) {
    alerts.layerType = layerTypeMessage;
  }

  return {
    keyframes: alerts.keyframes as false | string,
    layerType: alerts.layerType as false | string,
  };
}

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
  const layerType = parseLayerType(layer);
  const alerts = setDefaultAlerts(options.alerts, { layerType, layerName: layer.name });

  if ((layer.anchorPoint.numKeys, layer.position.numKeys)) {
    if (alerts && alerts.keyframes) {
      alert(alerts.keyframes);
    } else log(`Could not align anchor point of layer ${layer.name} because of anchor point or position keyframes.`);
    return;
  }

  if (!(layer instanceof TextLayer || layer instanceof AVLayer || layer instanceof ShapeLayer)) {
    if (alerts && alerts.layerType) {
      alert(alerts.layerType);
    } else log(`Could not align anchor point of layer ${layer.name} with type: ${layerType}`);
    return;
  }

  if (layer.source && !layer.source.hasVideo) {
    // alert("Cannot align anchor point of layer without video.");
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
