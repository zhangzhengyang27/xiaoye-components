import type { ComponentSize, SelectOption } from "@xiaoye/utils";

export interface SelectOptionGroup<T = string | number> {
  label: string;
  options: SelectOption<T>[];
  disabled?: boolean;
}

export type SelectOptionItem<T = string | number> = SelectOption<T> | SelectOptionGroup<T>;

export interface FlatSelectOption<T = string | number> extends SelectOption<T> {
  flatIndex: number;
  groupLabel?: string;
}

export interface SelectProps<T = string | number> {
  modelValue?: T | null;
  options: SelectOptionItem<T>[];
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  size?: ComponentSize;
  noDataText?: string;
  noMatchText?: string;
  loading?: boolean;
  loadingText?: string;
  searchPlaceholder?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  clearIcon?: string;
}

export const DEFAULT_CLEAR_ICON = "mdi:close-circle";
export const DEFAULT_SUFFIX_ICON = "mdi:chevron-down";
export const DEFAULT_LOADING_ICON = "mdi:loading";
