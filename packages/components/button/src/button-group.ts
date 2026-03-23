import type { ComponentSize } from "@xiaoye/utils";
import type { ButtonType } from "./button";

export const buttonGroupDirections = ["horizontal", "vertical"] as const;

export type ButtonGroupDirection = (typeof buttonGroupDirections)[number];

export interface ButtonGroupProps {
  size?: ComponentSize;
  type?: ButtonType;
  direction?: ButtonGroupDirection;
}
