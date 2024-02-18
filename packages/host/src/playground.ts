import { alignAnchorPoint } from "./tools/layer";

// alert(JSON.stringify(projectFonts));
for (let i = 1; i < app.project.items.length; i++) {
  const item = app.project.items[i];
  if (item.name === "Adam_Test") {
    const comp = item as CompItem;

    const layers = comp.layers;

    for (let ii = 1; ii <= layers.length; ii++) {
      const layer = layers[ii];
      //   alignAnchorPoint(layer, ["left", "top"]);
      alignAnchorPoint(layer, ["center", "center"], {
        rectangle: {
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
        },
      });
      //   getLayerRect(layer);
      if (layer.name === "Background") {
        // const avLayer = layer as AVLayer;
        // const source = avLayer.source as SolidSource;
        //         const anchorPoint = avLayer.transform.anchorPoint.value;
        //         const position = avLayer.position.value;
        //         const anchorPoint2 = avLayer.anchorPoint.value;
        //         const scale = avLayer.scale.value;
        //         const sourceRect = avLayer.sourceRectAtTime(comp.time, false);
        //         const width = avLayer.width;
        //         const height = avLayer.height;
        //         alert(`Anchor Point: ${anchorPoint}
        // Anchor Point 2: ${anchorPoint2}
        // Position: ${position}
        // Scale: ${scale}
        // Source Rect: ${JSON.stringify(sourceRect)}
        // Width: ${width}
        // Height: ${height}
        // `);
      }
    }
    break;
  }
}
