import type { DatePickerProps } from "xiaoye-components";

const props: DatePickerProps = {
  modelValue: "2026-03-22",
  clearable: true,
  type: "date"
};

void props;

const rangeProps: DatePickerProps = {
  modelValue: ["2026-03-22", "2026-03-28"],
  type: "daterange",
  shortcuts: [{ label: "最近 7 天", value: ["2026-03-22", "2026-03-28"] }],
  disabledDate: (date) => date.getDay() === 0
};

void rangeProps;

const invalidProps: DatePickerProps = {
  // @ts-expect-error invalid date type
  modelValue: 123
};

void invalidProps;
