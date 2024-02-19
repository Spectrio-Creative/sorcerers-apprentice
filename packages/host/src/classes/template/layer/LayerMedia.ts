import { searchLibrary } from "../../../tools/project";
import { parseLayerType, alignAnchorPoint, getLayerRect } from "../../../tools/layer";
import { FieldBase } from "../field/Field";
import { LayerBase } from "./LayerBase";

export class LayerMedia extends LayerBase {
  avLayer: AVLayer;
  originalRect: Rect;
  rectangle: Rect;

  constructor(layer: Layer, field: FieldBase, layerType?: LayerType) {
    super(layer, field, layerType);
    this.avLayer = layer as AVLayer;
    this.originalRect = getLayerRect(this.layer);
    this.rectangle = { ...this.originalRect };
    alignAnchorPoint(this.layer, ["center", "center"], { rectangle: this.originalRect });
  }

  setValue(value: string) {
    if (value === this.avLayer.source.name) return;
    const originalType = parseLayerType(this.layer);

    // Check if value exists in the library
    const item = searchLibrary(value, { maxResult: 1, strict: true })[0] || searchLibrary(value, { maxResult: 1 })[0];
    if (!item) return;

    this.avLayer.replaceSource(item as AVItem, true);
    if (originalType === "Solid") this.avLayer.scale.setValue([100, 100, 100]);

    alignAnchorPoint(this.layer, ["center", "center"]);
    this.rectangle = getLayerRect(this.layer);
    this.resize();
    if (this.field.options.includes("fill-size")) this.crop();
  }

  resize() {
    const options = this.field.options;
    const rect = getLayerRect(this.layer);

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

  crop() {
    const mask = (this.avLayer.property("Masks") as PropertyGroup).addProperty("Mask") as MaskPropertyGroup;
    mask.name = "Frame Crop";
    const shape = mask.maskShape.value;
    const scale = this.avLayer.scale.value[0] / 100;
    const rect = getLayerRect(this.layer);

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
    const rect = getLayerRect(this.layer);
    return rect.width > rect.height ? "width" : "height";
  }

  getScaleInfo() {
    const rect = getLayerRect(this.layer);
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
}
