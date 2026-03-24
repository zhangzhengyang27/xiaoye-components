import type { ComponentSize } from "@xiaoye/utils";

export type TimePickerValue = string | [string, string] | null;

export interface TimePickerProps {
  modelValue?: TimePickerValue;
  placeholder?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  size?: ComponentSize;
  format?: string;
  isRange?: boolean;
  validateEvent?: boolean;
  disabledHours?: () => number[];
  disabledMinutes?: (hour: number) => number[];
  disabledSeconds?: (hour: number, minute: number) => number[];
}
