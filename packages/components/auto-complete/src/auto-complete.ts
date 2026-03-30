import type { StyleValue } from "vue";
import type { Placement } from "@floating-ui/dom";
import type { ComponentSize, SelectOption } from "@xiaoye/utils";

export interface AutoCompleteOption<T = string | number> extends SelectOption<T> {
  disabled?: boolean;
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

export const DEFAULT_LOADING_ICON = "mdi:loading";
