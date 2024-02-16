// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericObject<T> = { [key: string]: T };

interface Layer {
  effect: (name: string) => PropertyGroup;
}

type AlignmentX = "left" | "right" | "center";
type AlignmentY = "top" | "bottom" | "center";
type Alignment = [AlignmentX, AlignmentY];

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}
