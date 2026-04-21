export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxValue = string | number | boolean;

export interface CheckboxProps {
  modelValue?: CheckboxValue;
  label?: string;
  disabled?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  size?: CheckboxSize;
  border?: boolean;
}

export type CheckboxInstance = InstanceType<import("./checkbox.vue").default>;
