import type { Placement } from "@floating-ui/dom";
import type { ComponentSize } from "@xiaoye/primitives";
import type { StyleValue } from "vue";

export type TimePickerValue = string | [string, string] | null;
export type TimePickerModelValueChangeHandler = (value: TimePickerValue) => void;
export type TimePickerChangeHandler = (value: TimePickerValue) => void;
export type TimePickerVisibleChangeHandler = (value: boolean) => void;

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
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  placement?: Placement;
  popperClass?: string;
  popperStyle?: StyleValue;
  disabledHours?: () => number[];
  disabledMinutes?: (hour: number) => number[];
  disabledSeconds?: (hour: number, minute: number) => number[];
}
