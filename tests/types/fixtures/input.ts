import type { InputProps } from "xiaoye-components";

const inputProps: InputProps = {
  modelValue: "hello",
  modelModifiers: {
    trim: true,
    lazy: true
  },
  maxlength: 20,
  minlength: 2,
  type: "textarea",
  resize: "vertical",
  autosize: {
    minRows: 2,
    maxRows: 4
  },
  autocomplete: "off",
  formatter: (value) => value.trim(),
  parser: (value) => value,
  placeholder: "请输入内容",
  readonly: false,
  clearable: true,
  clearIcon: "mdi:close-circle",
  showPassword: false,
  showWordLimit: true,
  wordLimitPosition: "outside",
  suffixIcon: "mdi:information-outline",
  prefixIcon: "mdi:magnify",
  tabindex: 0,
  validateEvent: true,
  autofocus: false,
  rows: 3,
  ariaLabel: "输入框",
  inputmode: "text",
  name: "keyword"
};

void inputProps;

const invalidType: InputProps = {
  // @ts-expect-error invalid type should be rejected
  type: "editor"
};

void invalidType;

const invalidResize: InputProps = {
  // @ts-expect-error invalid resize should be rejected
  resize: "free"
};

void invalidResize;

const invalidWordLimitPosition: InputProps = {
  // @ts-expect-error invalid word limit position should be rejected
  wordLimitPosition: "left"
};

void invalidWordLimitPosition;
