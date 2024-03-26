interface Font {
  font: string;
  fontFamily: string;
  fontStyle: string;
}

interface MediaItem {
  name: string;
  hasVideo: boolean;
  hasAudio: boolean;
  brokenLink: boolean;
  file?: string;
  fileName?: string;
  libraryPath?: string;
  typeName?: string;
}

type FieldOption = "visible" | "background-size" | "fill-size" | "no-scale" | "scale-down" | "linked-subtag";
