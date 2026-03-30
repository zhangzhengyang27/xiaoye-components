import type { StyleValue } from "vue";
import type { Placement } from "@floating-ui/dom";
import type { ComponentSize, SelectOption } from "@xiaoye/utils";

export interface SelectOptionGroup<T = string | number> {
  label: string;
  options: SelectOption<T>[];
  disabled?: boolean;
}

export type SelectOptionItem<T = string | number> = SelectOption<T> | SelectOptionGroup<T>;
export type SelectValue<T = string | number> = T | T[] | null;

export interface FlatSelectOption<T = string | number> extends SelectOption<T> {
  flatIndex: number;
  groupLabel?: string;
  created?: boolean;
}

export interface SelectProps<T = string | number> {
  modelValue?: SelectValue<T>;
  options: SelectOptionItem<T>[];
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  collapseTags?: boolean;
  maxTagCount?: number;
  remote?: boolean;
  allowCreate?: boolean;
  size?: ComponentSize;
  noDataText?: string;
  noMatchText?: string;
  loading?: boolean;
  loadingText?: string;
  searchPlaceholder?: string;
  createText?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  clearIcon?: string;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  placement?: Placement;
  offset?: number;
  popperClass?: string;
  popperStyle?: StyleValue;
  fitTriggerWidth?: boolean;
  fitInputWidth?: boolean;
  dropdownMinWidth?: string | number;
  dropdownMaxWidth?: string | number;
}

export const DEFAULT_CLEAR_ICON = "mdi:close-circle";
export const DEFAULT_SUFFIX_ICON = "mdi:chevron-down";
export const DEFAULT_LOADING_ICON = "mdi:loading";
