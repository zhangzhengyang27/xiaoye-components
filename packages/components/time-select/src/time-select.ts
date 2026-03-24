import type { ComponentSize } from "@xiaoye/utils";

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
}

export interface TimeSelectOption {
  value: string;
  label: string;
  disabled: boolean;
  totalMinutes: number;
}

export const DEFAULT_PLACEHOLDER = "请选择时间";
export const DEFAULT_START = "09:00";
export const DEFAULT_END = "18:00";
export const DEFAULT_STEP = "00:30";
export const DEFAULT_FORMAT = "HH:mm";
export const DEFAULT_CLEAR_ICON = "mdi:close-circle";
export const DEFAULT_PREFIX_ICON = "mdi:clock-outline";
export const DEFAULT_SUFFIX_ICON = "mdi:chevron-down";
