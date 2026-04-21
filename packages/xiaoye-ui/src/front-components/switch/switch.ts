export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps {
  modelValue?: boolean | string | number;
  disabled?: boolean;
  loading?: boolean;
  size?: SwitchSize;
  activeText?: string;
  inactiveText?: string;
  activeValue?: boolean | string | number;
  inactiveValue?: boolean | string | number;
}

export type SwitchInstance = InstanceType<import("./switch.vue").default>;
