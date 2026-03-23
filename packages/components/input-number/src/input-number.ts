import type { HTMLAttributes } from "vue";
import type { ComponentSize } from "@xiaoye/utils";

export interface InputNumberProps {
  id?: string;
  modelValue?: number | null;
  min?: number;
  max?: number;
  step?: number;
  stepStrictly?: boolean;
  precision?: number;
  size?: ComponentSize;
  disabled?: boolean;
  readonly?: boolean;
  controls?: boolean;
  controlsPosition?: "" | "right";
  valueOnClear?: "min" | "max" | number | null;
  placeholder?: string;
  name?: string;
  validateEvent?: boolean;
  ariaLabel?: string;
  inputmode?: HTMLAttributes["inputmode"];
  align?: "left" | "center" | "right";
  disabledScientific?: boolean;
}

export const DEFAULT_DECREASE_ICON = "mdi:minus";
export const DEFAULT_INCREASE_ICON = "mdi:plus";
export const DEFAULT_DECREASE_ICON_RIGHT = "mdi:chevron-down";
export const DEFAULT_INCREASE_ICON_RIGHT = "mdi:chevron-up";
