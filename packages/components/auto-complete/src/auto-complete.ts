import type { StyleValue } from "vue";
import type { Placement } from "@floating-ui/dom";
import type { ComponentSize, SelectOption } from "@xiaoye/utils";

export interface AutoCompleteOption<T = string | number> extends SelectOption<T> {
  disabled?: boolean;
}

export type AutoCompleteValueChangeHandler = (value: AutoCompleteValue) => void;
export type AutoCompleteVisibleChangeHandler = (value: boolean) => void;
export type AutoCompleteSearchChangeHandler = (value: string) => void;
export type AutoCompleteSelectHandler<T = string | number> = (
  option: AutoCompleteOption<T>
) => void;

export interface AutoCompleteOptionSlotProps<T = string | number> {
  option: AutoCompleteOption<T>;
  active: boolean;
}

export interface AutoCompleteProps<T = string | number> {
  modelValue?: string;
  options: AutoCompleteOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  remote?: boolean;
  loading?: boolean;
  loadingText?: string;
  size?: ComponentSize;
  prefixIcon?: string;
  suffixIcon?: string;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  placement?: Placement;
  offset?: number;
  popperClass?: string;
  popperStyle?: StyleValue;
  dropdownMinWidth?: string | number;
  dropdownMaxWidth?: string | number;
}

export type AutoCompleteValue = string;
export interface AutoCompleteInstance {
  focus: () => void;
  blur: () => Promise<void>;
  open: () => Promise<void>;
  close: (shouldValidate?: boolean, restoreFocus?: boolean) => Promise<void>;
}

export const DEFAULT_LOADING_ICON = "mdi:loading";
