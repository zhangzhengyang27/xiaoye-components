import type { HTMLAttributes, StyleValue } from "vue";
import type { ComponentSize } from "@xiaoye/utils";

export type InputModelModifiers = {
  lazy?: true;
  number?: true;
  trim?: true;
};

export type InputAutoSize = { minRows?: number; maxRows?: number } | boolean;

export type InputType =
  | "text"
  | "textarea"
  | "number"
  | "password"
  | "email"
  | "search"
  | "tel"
  | "url";

export interface InputProps {
  id?: string;
  size?: ComponentSize;
  disabled?: boolean;
  modelValue?: string | number | null | undefined;
  modelModifiers?: InputModelModifiers;
  maxlength?: string | number;
  minlength?: string | number;
  type?: InputType;
  resize?: "none" | "both" | "horizontal" | "vertical";
  autosize?: InputAutoSize;
  autocomplete?: string;
  formatter?: (value: string) => string;
  parser?: (value: string) => string;
  placeholder?: string;
  form?: string;
  readonly?: boolean;
  clearable?: boolean;
  clearIcon?: string;
  showPassword?: boolean;
  showWordLimit?: boolean;
  wordLimitPosition?: "inside" | "outside";
  suffixIcon?: string;
  prefixIcon?: string;
  containerRole?: string;
  tabindex?: string | number;
  validateEvent?: boolean;
  inputStyle?: StyleValue;
  autofocus?: boolean;
  rows?: number;
  ariaLabel?: string;
  inputmode?: HTMLAttributes["inputmode"];
  name?: string;
}

export const DEFAULT_CLEAR_ICON = "mdi:close-circle";
export const DEFAULT_PASSWORD_VISIBLE_ICON = "mdi:eye-outline";
export const DEFAULT_PASSWORD_HIDDEN_ICON = "mdi:eye-off-outline";
