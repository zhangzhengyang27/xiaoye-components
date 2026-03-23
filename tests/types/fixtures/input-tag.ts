import type { InputTagProps, InputTagTrigger } from "xiaoye-components";

const trigger: InputTagTrigger = "Enter";

const inputTagProps: InputTagProps = {
  modelValue: ["Vue", "组件库"],
  max: 5,
  trigger,
  draggable: true,
  delimiter: ",",
  size: "md",
  disabled: false,
  readonly: false,
  clearable: true,
  clearIcon: "mdi:close-circle",
  validateEvent: true,
  autofocus: false,
  tabindex: 0,
  maxlength: 24,
  minlength: 1,
  placeholder: "输入后按回车添加标签",
  autocomplete: "off",
  saveOnBlur: true,
  ariaLabel: "标签输入框",
  name: "skills",
  tagStatus: "primary",
  tagRound: true,
  inputmode: "text",
  inputStyle: {
    minWidth: "240px"
  }
};

void inputTagProps;

const invalidTrigger: InputTagProps = {
  // @ts-expect-error invalid trigger should be rejected
  trigger: "Tab"
};

void invalidTrigger;
