export type InputNumberSize = "sm" | "md" | "lg";

export interface InputNumberProps {
  modelValue?: number;
  min?: number;
  max?: number;
  step?: number;
  size?: InputNumberSize;
  disabled?: boolean;
  readonly?: boolean;
  precision?: number;
  controls?: boolean;
  controlsPosition?: "both" | "right";
  placeholder?: string;
}

export type InputNumberInstance = InstanceType<import("./input-number.vue").default>;
