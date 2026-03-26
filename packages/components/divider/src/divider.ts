import type { ComponentSize, ComponentStatus } from "@xiaoye/utils";

export const dividerDirections = ["horizontal", "vertical"] as const;
export const dividerContentPositions = ["left", "center", "right"] as const;

export type DividerDirection = (typeof dividerDirections)[number];
export type DividerContentPosition = (typeof dividerContentPositions)[number];
export type DividerBorderStyle = CSSStyleDeclaration["borderStyle"];

export interface DividerProps {
  direction?: DividerDirection;
  contentPosition?: DividerContentPosition;
  borderStyle?: DividerBorderStyle;
  size?: ComponentSize;
  status?: ComponentStatus;
}
