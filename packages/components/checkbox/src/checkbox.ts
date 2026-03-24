import type { ComponentSize } from "@xiaoye/utils";

export type CheckboxValue = string | number | boolean;

export interface CheckboxProps {
  id?: string;
  modelValue?: CheckboxValue;
  value?: CheckboxValue;
  label?: string | number | boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  checked?: boolean;
  name?: string;
  trueValue?: string | number;
  falseValue?: string | number;
  border?: boolean;
  size?: ComponentSize;
  tabindex?: string | number;
  validateEvent?: boolean;
  ariaLabel?: string;
  ariaControls?: string;
}
