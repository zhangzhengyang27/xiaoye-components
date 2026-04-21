export type DatePickerType = "date" | "datetime" | "year" | "month" | "week";
export type DatePickerPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

export interface DatePickerProps {
  modelValue?: string;
  type?: DatePickerType;
  placeholder?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  format?: string;
  disabledDate?: (date: Date) => boolean;
}

export interface DatePickerEmits {
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}

export type DatePickerInstance = InstanceType<import("./date-picker.vue").default>;
