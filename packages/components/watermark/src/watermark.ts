import type Watermark from "./watermark.vue";

export type WatermarkFontWeight = "normal" | "bold" | "lighter" | "bolder" | number;
export type WatermarkFontStyle = "none" | "normal" | "italic" | "oblique";
export type WatermarkTextAlign = "start" | "end" | "left" | "right" | "center";
export type WatermarkTextBaseline =
  | "top"
  | "hanging"
  | "middle"
  | "alphabetic"
  | "ideographic"
  | "bottom";
export type WatermarkRepeat = "repeat" | "repeat-x" | "repeat-y" | "no-repeat";
export type WatermarkRenderSource = "text" | "image";

export interface WatermarkRenderPayload {
  dataUrl: string;
  width: number;
  height: number;
  source: WatermarkRenderSource;
  target: HTMLElement;
}

export interface WatermarkFont {
  color?: string;
  fontSize?: number | string;
  fontWeight?: WatermarkFontWeight;
  fontStyle?: WatermarkFontStyle;
  fontFamily?: string;
  fontGap?: number;
  textAlign?: WatermarkTextAlign;
  textBaseline?: WatermarkTextBaseline;
}

export interface WatermarkProps {
  zIndex?: number;
  rotate?: number;
  width?: number;
  height?: number;
  image?: string;
  content?: string | string[];
  font?: WatermarkFont;
  gap?: [number, number];
  offset?: [number, number];
  disabled?: boolean;
  opacity?: number;
  repeat?: WatermarkRepeat;
  autoObserve?: boolean;
  fullscreen?: boolean;
  target?: string | HTMLElement;
}

export type WatermarkInstance = InstanceType<typeof Watermark>;
