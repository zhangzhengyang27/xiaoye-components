export type RadioSize = "sm" | "md" | "lg";
export type RadioValue = string | number | boolean;

export interface RadioProps {
  modelValue?: RadioValue;
  label?: string;
  disabled?: boolean;
  checked?: boolean;
  size?: RadioSize;
  border?: boolean;
  name?: string;
}

export type RadioInstance = InstanceType<import("./radio.vue").default>;
