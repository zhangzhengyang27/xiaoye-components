export type SliderSize = "sm" | "md" | "lg";

export interface SliderProps {
  modelValue?: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  size?: SliderSize;
  disabled?: boolean;
  showInput?: boolean;
  showStops?: boolean;
  range?: boolean;
  vertical?: boolean;
  height?: string;
}

export type SliderInstance = InstanceType<import("./slider.vue").default>;
