import type { ComponentSize } from "@xiaoye/primitives";

export type DatePickerType = "date" | "daterange" | "month" | "year" | "week";
export type DatePickerValue = string | [string, string] | null;
export type DatePickerValueChangeHandler = (value: DatePickerValue) => void;
export type DatePickerVisibleChangeHandler = (value: boolean) => void;

export interface DatePickerShortcut {
  label: string;
  value: DatePickerValue | (() => DatePickerValue);
}

export interface DatePickerProps {
  modelValue?: DatePickerValue;
  type?: DatePickerType;
  placeholder?: string | string[];
  disabled?: boolean;
  clearable?: boolean;
  size?: ComponentSize;
  min?: string;
  max?: string;
  format?: string;
  valueFormat?: string;
  shortcuts?: DatePickerShortcut[];
  disabledDate?: (date: Date) => boolean;
  separator?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  clearIcon?: string;
  editable?: boolean;
  teleported?: boolean;
  popperClass?: string;
  popperStyle?: Record<string, unknown>;
  appendTo?: string | HTMLElement;
  placement?: string;
  modelModifiers?: { lazy?: boolean };
}
