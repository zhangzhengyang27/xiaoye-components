import type TimeSelect from "./time-select.vue";
import type { Placement } from "@floating-ui/dom";
import type { ComponentSize } from "@xiaoye/primitives";
import type { StyleValue } from "vue";

export type TimeSelectValueChangeHandler = (value: string | null) => void;
export type TimeSelectVisibleChangeHandler = (value: boolean) => void;

export interface TimeSelectProps {
  modelValue?: string | null;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  size?: ComponentSize;
  start?: string;
  end?: string;
  step?: string;
  minTime?: string;
  maxTime?: string;
  includeEndTime?: boolean;
  format?: string;
  validateEvent?: boolean;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  placement?: Placement;
  popperClass?: string;
  popperStyle?: StyleValue;
}

export interface TimeSelectOption {
  value: string;
  label: string;
  disabled: boolean;
  totalMinutes: number;
}

export type TimeSelectInstance = InstanceType<typeof TimeSelect>;

export const DEFAULT_PLACEHOLDER = "请选择时间";
export const DEFAULT_START = "09:00";
export const DEFAULT_END = "18:00";
export const DEFAULT_STEP = "00:30";
export const DEFAULT_FORMAT = "HH:mm";
export const DEFAULT_CLEAR_ICON = "mdi:close-circle";
export const DEFAULT_PREFIX_ICON = "mdi:clock-outline";
export const DEFAULT_SUFFIX_ICON = "mdi:chevron-down";
