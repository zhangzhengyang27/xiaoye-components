import type { ComponentSize } from "@xiaoye/utils";

export type RadioValue = string | number | boolean;
export type RadioValueChangeHandler = (value: RadioValue) => void;

export interface RadioProps {
  id?: string;
  modelValue?: RadioValue;
  value: RadioValue;
  label?: string;
  disabled?: boolean;
  size?: ComponentSize;
  name?: string;
  border?: boolean;
}
