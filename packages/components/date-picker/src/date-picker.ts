import type { ComponentSize } from "@xiaoye/utils";

export type DatePickerType = "date" | "daterange" | "month" | "year" | "week";
export type DatePickerValue = string | [string, string] | null;

export interface DatePickerShortcut {
  label: string;
  value: DatePickerValue | (() => DatePickerValue);
}

export interface DatePickerProps {
  modelValue?: DatePickerValue;
  type?: DatePickerType;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  size?: ComponentSize;
  min?: string;
  max?: string;
  format?: string;
  valueFormat?: string;
  shortcuts?: DatePickerShortcut[];
  disabledDate?: (date: Date) => boolean;
}
