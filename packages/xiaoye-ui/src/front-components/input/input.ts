export type InputSize = "sm" | "md" | "lg";

export interface InputProps {
  modelValue?: string | number;
  type?: string;
  size?: InputSize;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  showPassword?: boolean;
  placeholder?: string;
  maxlength?: number | string;
  minlength?: number | string;
  prefixIcon?: string;
  suffixIcon?: string;
  prefixText?: string;
  suffixText?: string;
  autosize?: boolean | { minRows?: number; maxRows?: number };
  rows?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
  autocomplete?: string;
  autofocus?: boolean;
  name?: string;
}

export type InputInstance = InstanceType<import("./input.vue").default>;
