export interface TimePickerProps {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  format?: string;
  step?: { hour?: number; minute?: number; second?: number };
}

export interface TimePickerEmits {
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}

export type TimePickerInstance = InstanceType<import("./time-picker.vue").default>;
