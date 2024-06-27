import { importFile, searchLibrary } from "../../../tools/project";
import { parseLayerType, alignAnchorPoint, getLayerRect } from "../../../tools/layer";
import { LayerBase, LayerBaseOptions } from "./LayerBase";
import { log } from "../../../tools/system";
import { copyProperties, ExcludableProperties } from "../../../tools/layers";

export class LayerMedia extends LayerBase {
  avLayer: AVLayer;
  originalAVLayer: AVLayer;
  preComp?: CompItem;
  originalRect: Rect;
  rectangle: Rect;

  constructor(options: LayerBaseOptions) {
    super(options);
    this.avLayer = options.layer as AVLayer;
    this.originalAVLayer = this.avLayer;
    this.originalRect = getLayerRect(this.layer);
    this.rectangle = { ...this.originalRect };
    this.preCompose(`Precomp - ${this.avLayer.name} - [${this.fieldRef.parent.name}]`);
    alignAnchorPoint(this.layer, ["center", "center"], { rectangle: this.originalRect });
  }

  setValue(value: string) {
    if (value === this.avLayer.source.name) return;
    const originalType = parseLayerType(this.originalAVLayer as Layer);

    // Check if value exists in the library
    let item =
      searchLibrary(value, { maxResult: 1, strict: true, type: "NonFolder" })[0] ||
      searchLibrary(value, { maxResult: 1, type: "NonFolder" })[0] ||
      importFile(value);

    log(`Importing ${value} as item of type ${item?.typeName}`);
    if (!item) return;

    // Add the new item to the precomp
    this.avLayer = this.preComp.layers.add(item as AVItem);

    if (originalType === "Solid") this.avLayer.scale.setValue([100, 100, 100]);
    this.layer.scale.setValue([100, 100, 100]);

    this.rectangle = getLayerRect(this.avLayer as Layer);
    this.resize();
    this.positionLayer();
    if (this.field.options.includes("fill-size")) this.crop();
    this.copyPoperties();

    // Hide original layer
    this.originalAVLayer.enabled = false;
  }

  resize() {
    const options = this.field.options;
    const rect = getLayerRect(this.avLayer as Layer);

    if (options.includes("no-scale")) return;

    const scale = this.getScaleInfo();

    if (
      options.includes("scale-down") &&
      rect.width > this.originalRect.width &&
      rect.height > this.originalRect.height
    ) {
      this.avLayer.scale.setValue([100 / scale.contain, 100 / scale.contain, 100 / scale.contain]);
      return;
    }

    if (options.includes("background-size") || options.includes("fill-size")) {
      this.avLayer.scale.setValue([100 / scale.cover, 100 / scale.cover, 100 / scale.cover]);
      return;
    }

    this.avLayer.scale.setValue([100 / scale.contain, 100 / scale.contain, 100 / scale.contain]);
  }

  positionLayer(alignmentRoot: "position" | "anchorPoint" = "position") {
    alignAnchorPoint(this.avLayer as Layer, ["center", "center"]);

    const rect = getLayerRect(this.avLayer as Layer);
    const originalRect = this.originalRect;
    const sizeDelta = [rect.width - originalRect.width, rect.height - originalRect.height];
    const delta = [rect.left - originalRect.left, rect.top - originalRect.top];
    const position = this.avLayer[alignmentRoot].value;
    // New position centers this.avLayer in the original position
    const newPosition = [
      position[0] - delta[0] - sizeDelta[0] / 2,
      position[1] - delta[1] - sizeDelta[1] / 2,
    ] as TwoDPoint;

    this.avLayer[alignmentRoot].setValue(newPosition);
  }

  copyPoperties() {
    const [positionKeys, anchorKeys, scaleKeys] = [
      this.originalAVLayer.position.numKeys > 0,
      this.originalAVLayer.anchorPoint.numKeys > 0,
      this.originalAVLayer.scale.numKeys > 0,
    ];

    const excludedProperties: ExcludableProperties[] = ["scale"];
    if (!positionKeys) excludedProperties.push("position");
    if (!anchorKeys) excludedProperties.push("anchorPoint");

    copyProperties(this.originalAVLayer as Layer, this.avLayer as Layer, excludedProperties);

    // If there are no keyframes on the original layer the layers should be aligned
    if (!positionKeys && !anchorKeys && !scaleKeys) return;

    // Align based on whether anchor point or position has keyframes
    if (positionKeys && anchorKeys)
      log(`WARNING: Both position and anchor point have keyframes for ${this.avLayer.name} alignment may be off.`);
    this.positionLayer(positionKeys ? "anchorPoint" : "position");

    if (scaleKeys) {
      if (anchorKeys)
        log(`WARNING: Both scale and anchor point have keyframes for ${this.avLayer.name} alignment may be off.`);
      // Copy scale keyframes relative to the original scale
      const originalScale = this.originalAVLayer.scale.value;
      const currentScale = this.avLayer.scale.value;
      const scaleRatio = [currentScale[0] / originalScale[0], currentScale[1] / originalScale[1]] as TwoDPoint;

      for (let i = 1; i <= this.originalAVLayer.scale.numKeys; i++) {
        const keyTime = this.originalAVLayer.scale.keyTime(i);
        const keyScale = this.originalAVLayer.scale.keyValue(i);
        const newScale = [keyScale[0] * scaleRatio[0], keyScale[1] * scaleRatio[1]] as TwoDPoint;
        this.avLayer.scale.setValueAtTime(keyTime, newScale);
      }
    }
  }

  crop() {
    const mask = (this.avLayer.property("Masks") as PropertyGroup).addProperty("Mask") as MaskPropertyGroup;
    mask.name = "Frame Crop";
    const shape = mask.maskShape.value;
    const scale = this.avLayer.scale.value[0] / 100;
    const rect = getLayerRect(this.avLayer as Layer);

    shape.vertices = [
      [this.originalRect.left, this.originalRect.top],
      [this.originalRect.left, this.originalRect.top + this.originalRect.height],
      [this.originalRect.left + this.originalRect.width, this.originalRect.top + this.originalRect.height],
      [this.originalRect.left + this.originalRect.width, this.originalRect.top],
    ];
    shape.vertices = shape.vertices.map((vertex) => {
      return [(vertex[0] - rect.left) / scale, (vertex[1] - rect.top) / scale];
    });
    shape.closed = true;
    mask.maskShape.setValue(shape);
  }

  getOrientation(): "width" | "height" {
    const rect = getLayerRect(this.avLayer as Layer);
    return rect.width > rect.height ? "width" : "height";
  }

  getScaleInfo() {
    const rect = getLayerRect(this.avLayer as Layer);
    const ratio = rect.width / rect.height;
    const originalRatio = this.originalRect.width / this.originalRect.height;

    // Check if the original was wider or taller than the current
    const containDimension = ratio >= originalRatio ? "width" : "height";
    const coverDimension = ratio > originalRatio ? "height" : "width";
    const containScale =
      containDimension === "width" ? rect.width / this.originalRect.width : rect.height / this.originalRect.height;
    const coverScale =
      coverDimension === "width" ? rect.width / this.originalRect.width : rect.height / this.originalRect.height;
    return {
      contain: containScale,
      cover: coverScale,
    };
  }

  preCompose(name: string) {
    const layerName = this.layer.name;
    const containingComp = this.layer.containingComp;
    const LayerIndex = this.layer.index;
    this.preComp = containingComp.layers.precompose([LayerIndex], name, true);
    // Move precomp to the precomps folder inside the specific template folder
    const templateFolder = this.fieldRef.parent.folder;
    this.layer = containingComp.layer(LayerIndex);

    // Rename the inner layer to the original layer name and set as the avLayer
    this.avLayer = this.preComp.layer(1) as AVLayer;
    this.avLayer.name = layerName;

    this.originalAVLayer = this.avLayer as AVLayer;

    // Check if the precomps folder exists
    for (let i = 1; i <= templateFolder.numItems; i++) {
      const item = templateFolder.items[i];
      if (item.name === "Precomps" && item instanceof FolderItem) {
        this.preComp.parentFolder = item as FolderItem;
        return;
      }
    }
    const precompFolder = templateFolder.items.addFolder("Precomps");
    this.preComp.parentFolder = precompFolder;
  }
}
