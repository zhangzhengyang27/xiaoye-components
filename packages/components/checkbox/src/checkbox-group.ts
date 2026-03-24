import type { ComponentSize } from "@xiaoye/utils";
import type { CheckboxValue } from "./checkbox";

export const checkboxGroupDirections = ["horizontal", "vertical"] as const;

export type CheckboxGroupDirection = (typeof checkboxGroupDirections)[number];
export type CheckboxGroupValue = CheckboxValue[];

export interface CheckboxOption {
  label: string;
  value: CheckboxValue;
  disabled?: boolean;
  description?: string;
}

export interface CheckboxGroupProps {
  modelValue?: CheckboxGroupValue;
  options?: CheckboxOption[];
  type?: "checkbox" | "button";
  disabled?: boolean;
  size?: ComponentSize;
  name?: string;
  direction?: CheckboxGroupDirection;
  validateEvent?: boolean;
  ariaLabel?: string;
  fill?: string;
  textColor?: string;
  min?: number;
  max?: number;
}
