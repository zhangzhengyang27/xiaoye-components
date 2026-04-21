export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface SelectProps {
  modelValue?: string | number | (string | number)[];
  options?: SelectOption[];
  placeholder?: string;
  size?: SelectSize;
  disabled?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  collapseTags?: boolean;
  maxTagCount?: number;
  noDataText?: string;
}

export type SelectInstance = InstanceType<import("./select.vue").default>;
