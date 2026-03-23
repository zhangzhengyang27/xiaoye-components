import type { SliderProps } from "xiaoye-components";

const singleProps: SliderProps = {
  modelValue: 40,
  showInput: true,
  showStops: true,
  formatTooltip: (value) => `${value}%`
};

void singleProps;

const rangeProps: SliderProps = {
  modelValue: [20, 80],
  range: true,
  rangeStartLabel: "最低值",
  rangeEndLabel: "最高值",
  placement: "right"
};

void rangeProps;

const invalidProps: SliderProps = {
  // @ts-expect-error invalid placement should be rejected
  placement: "center"
};

void invalidProps;
