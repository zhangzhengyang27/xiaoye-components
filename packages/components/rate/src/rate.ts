import type { ComponentSize } from "@xiaoye/utils";

export type RateColorMap = string[] | Record<number, string>;
export type RateIconMap = string[] | Record<number, string>;

export interface RateProps {
  modelValue?: number | null;
  id?: string;
  lowThreshold?: number;
  highThreshold?: number;
  max?: number;
  colors?: RateColorMap;
  voidColor?: string;
  disabledVoidColor?: string;
  icons?: RateIconMap;
  voidIcon?: string;
  disabledVoidIcon?: string;
  disabled?: boolean;
  allowHalf?: boolean;
  showText?: boolean;
  showScore?: boolean;
  textColor?: string;
  texts?: string[];
  scoreTemplate?: string;
  size?: ComponentSize;
  clearable?: boolean;
  ariaLabel?: string;
  validateEvent?: boolean;
}

export const DEFAULT_RATE_TEXTS = ["极差", "失望", "一般", "满意", "惊喜"];
export const DEFAULT_RATE_COLORS = ["#94a3b8", "#f59e0b", "#f97316"];
export const DEFAULT_RATE_ICONS = ["mdi:star", "mdi:star", "mdi:star"];
export const DEFAULT_RATE_VOID_ICON = "mdi:star-outline";
export const DEFAULT_RATE_DISABLED_VOID_ICON = "mdi:star-outline";
