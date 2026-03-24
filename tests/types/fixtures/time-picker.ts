import type { TimePickerProps } from "xiaoye-components";

const singleProps: TimePickerProps = {
  modelValue: "09:30:15",
  clearable: true,
  format: "HH:mm:ss",
  disabledHours: () => [0, 1, 2]
};

void singleProps;

const rangeProps: TimePickerProps = {
  modelValue: ["09:00", "18:00"],
  isRange: true,
  format: "HH:mm"
};

void rangeProps;

const invalidProps: TimePickerProps = {
  // @ts-expect-error invalid model value type
  modelValue: 123
};

void invalidProps;
