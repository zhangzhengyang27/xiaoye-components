export interface ColorPickerProps {
  modelValue?: string;
  disabled?: boolean;
  alpha?: boolean;
  format?: "hex" | "rgb" | "hsl";
  predefine?: string[];
}

export interface ColorPickerEmits {
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}

export type ColorPickerInstance = InstanceType<import("./color-picker.vue").default>;
