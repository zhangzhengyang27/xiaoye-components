import type { DatePickerProps } from "xiaoye-components";

const props: DatePickerProps = {
  modelValue: "2026-03-22",
  clearable: true
};

void props;

const invalidProps: DatePickerProps = {
  // @ts-expect-error invalid date type
  modelValue: 123
};

void invalidProps;
