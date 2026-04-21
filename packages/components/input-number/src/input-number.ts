import type InputNumber from "./input-number.vue";
import type { HTMLAttributes } from "vue";
import type { ComponentSize } from "@xiaoye/primitives";

export type InputNumberValueChangeHandler = (value: number | null) => void;
export type InputNumberChangeHandler = (
  value: number | null,
  oldValue: number | null
) => void;
export type InputNumberFocusHandler = (event: FocusEvent) => void;

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

export type InputNumberInstance = InstanceType<typeof InputNumber>;

export const DEFAULT_DECREASE_ICON = "mdi:minus";
export const DEFAULT_INCREASE_ICON = "mdi:plus";
export const DEFAULT_DECREASE_ICON_RIGHT = "mdi:chevron-down";
export const DEFAULT_INCREASE_ICON_RIGHT = "mdi:chevron-up";
