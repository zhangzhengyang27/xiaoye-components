import type { TimeSelectProps } from "xiaoye-components";

const timeSelectProps: TimeSelectProps = {
  modelValue: "09:30",
  clearable: true,
  disabled: false,
  size: "md",
  start: "08:00",
  end: "18:30",
  step: "00:30",
  minTime: "09:00",
  maxTime: "18:00",
  includeEndTime: true,
  format: "hh:mm A",
  validateEvent: true,
  placeholder: "请选择会议时间"
};

void timeSelectProps;

const invalidModelValue: TimeSelectProps = {
  // @ts-expect-error modelValue should be a string or null
  modelValue: 930
};

void invalidModelValue;

const invalidIncludeEndTime: TimeSelectProps = {
  // @ts-expect-error includeEndTime should be a boolean
  includeEndTime: "true"
};

void invalidIncludeEndTime;
