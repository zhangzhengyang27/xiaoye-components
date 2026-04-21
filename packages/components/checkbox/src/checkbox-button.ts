import type { ComponentSize } from "@xiaoye/primitives";
import type { CheckboxValue } from "./checkbox";

export interface CheckboxButtonProps {
  modelValue?: CheckboxValue;
  value?: CheckboxValue;
  label?: string | number | boolean;
  disabled?: boolean;
  size?: ComponentSize;
  name?: string;
}
