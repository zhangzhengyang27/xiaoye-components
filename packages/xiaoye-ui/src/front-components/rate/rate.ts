export type RateSize = "sm" | "md" | "lg";

export interface RateProps {
  modelValue?: number;
  max?: number;
  size?: RateSize;
  disabled?: boolean;
  readonly?: boolean;
  allowHalf?: boolean;
  allowClear?: boolean;
  color?: string;
  voidColor?: string;
  disabledVoidColor?: string;
  icon?: string;
  voidIcon?: string;
  showText?: boolean;
  textColor?: string;
  texts?: string[];
}

export type RateInstance = InstanceType<import("./rate.vue").default>;
