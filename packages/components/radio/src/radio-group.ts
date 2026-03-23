import type { ComponentSize } from "@xiaoye/utils";
import type { RadioValue } from "./radio";

export const radioGroupDirections = ["horizontal", "vertical"] as const;

export type RadioGroupDirection = (typeof radioGroupDirections)[number];

export interface RadioOption {
  label: string;
  value: RadioValue;
  disabled?: boolean;
  description?: string;
}

export interface RadioGroupProps {
  modelValue?: RadioValue;
  options?: RadioOption[];
  type?: "radio" | "button";
  disabled?: boolean;
  size?: ComponentSize;
  name?: string;
  direction?: RadioGroupDirection;
  validateEvent?: boolean;
  ariaLabel?: string;
  fill?: string;
  textColor?: string;
}
