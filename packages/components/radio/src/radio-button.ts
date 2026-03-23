import type { ComponentSize } from "@xiaoye/utils";
import type { RadioValue } from "./radio";

export interface RadioButtonProps {
  modelValue?: RadioValue;
  value: RadioValue;
  label?: string;
  disabled?: boolean;
  size?: ComponentSize;
  name?: string;
}
