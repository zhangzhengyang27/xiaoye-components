import type { StyleValue } from "vue";

export interface ScrollbarProps {
  distance?: number;
  height?: number | string;
  maxHeight?: number | string;
  native?: boolean;
  wrapStyle?: StyleValue;
  wrapClass?: string | string[];
  viewClass?: string | string[];
  viewStyle?: StyleValue;
  noresize?: boolean;
  tag?: string;
  always?: boolean;
  minSize?: number;
  tabindex?: number | string;
  id?: string;
  role?: string;
  ariaLabel?: string;
  ariaOrientation?: "horizontal" | "vertical" | "undefined";
}

export type ScrollbarDirection = "top" | "bottom" | "left" | "right";
