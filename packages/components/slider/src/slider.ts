import type Slider from "./slider.vue";
import type { ComponentSize } from "@xiaoye/primitives";

export type SliderValue = number | [number, number];
export type SliderPlacement = "top" | "bottom" | "left" | "right";
export type SliderValueChangeHandler = (value: SliderValue) => void;
export type SliderFocusHandler = (event: FocusEvent) => void;

export interface SliderProps {
  modelValue?: SliderValue;
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  showInput?: boolean;
  showInputControls?: boolean;
  size?: ComponentSize;
  inputSize?: ComponentSize;
  showStops?: boolean;
  showTooltip?: boolean;
  formatTooltip?: (value: number) => number | string;
  disabled?: boolean;
  range?: boolean;
  vertical?: boolean;
  height?: string;
  rangeStartLabel?: string;
  rangeEndLabel?: string;
  formatValueText?: (value: number) => string;
  tooltipClass?: string;
  placement?: SliderPlacement;
  validateEvent?: boolean;
  persistent?: boolean;
  ariaLabel?: string;
}

export type SliderInstance = InstanceType<typeof Slider>;
