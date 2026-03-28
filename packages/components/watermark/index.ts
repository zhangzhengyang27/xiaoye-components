import Watermark from "./src/watermark.vue";
import type {
  WatermarkFont,
  WatermarkFontStyle,
  WatermarkFontWeight,
  WatermarkInstance,
  WatermarkProps,
  WatermarkRenderPayload,
  WatermarkRenderSource,
  WatermarkRepeat,
  WatermarkTextAlign,
  WatermarkTextBaseline
} from "./src/watermark";
import { withInstall } from "@xiaoye/utils";

export type {
  WatermarkFont,
  WatermarkFontStyle,
  WatermarkFontWeight,
  WatermarkInstance,
  WatermarkProps,
  WatermarkRenderPayload,
  WatermarkRenderSource,
  WatermarkRepeat,
  WatermarkTextAlign,
  WatermarkTextBaseline
};

export const XyWatermark = withInstall(Watermark, "xy-watermark");
export default XyWatermark;
