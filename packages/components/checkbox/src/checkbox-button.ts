import type { ComponentSize } from "@xiaoye/utils";
import type { CheckboxValue } from "./checkbox";

export interface CheckboxButtonProps {
  modelValue?: CheckboxValue;
  value?: CheckboxValue;
  label?: string | number | boolean;
  disabled?: boolean;
  size?: ComponentSize;
  name?: string;
}
