import type { ComponentSize } from "@xiaoye/primitives";
import type { RadioValue } from "./radio";

export interface RadioButtonProps {
  modelValue?: RadioValue;
  value: RadioValue;
  label?: string;
  disabled?: boolean;
  size?: ComponentSize;
  name?: string;
}
