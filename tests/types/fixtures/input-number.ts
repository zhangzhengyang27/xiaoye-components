import type { InputNumberProps } from "xiaoye-components";

const props: InputNumberProps = {
  modelValue: 12,
  min: 0,
  max: 99,
  step: 0.5,
  stepStrictly: false,
  precision: 1,
  size: "md",
  controls: true,
  controlsPosition: "right",
  valueOnClear: "min",
  placeholder: "请输入数量",
  name: "amount",
  validateEvent: true,
  ariaLabel: "数量输入框",
  inputmode: "decimal",
  align: "right",
  disabledScientific: true
};

void props;

const invalidProps: InputNumberProps = {
  // @ts-expect-error align should be limited to left/center/right
  align: "justify"
};

void invalidProps;
