import type { ComponentSize } from "@xiaoye/utils";

export type SliderValue = number | [number, number];
export type SliderPlacement = "top" | "bottom" | "left" | "right";

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
