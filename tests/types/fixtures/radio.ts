import type { RadioButtonProps, RadioGroupProps, RadioProps, RadioValue } from "xiaoye-components";

const modelValue: RadioValue = "prod";

const radioProps: RadioProps = {
  modelValue,
  value: "staging",
  label: "预发环境",
  disabled: false,
  size: "md",
  name: "scene",
  border: true
};

void radioProps;

const radioGroupProps: RadioGroupProps = {
  modelValue,
  options: [
    { label: "开发环境", value: "dev" },
    { label: "预发环境", value: "staging", description: "灰度验证" },
    { label: "生产环境", value: "prod" }
  ],
  type: "button",
  disabled: false,
  size: "sm",
  name: "scene",
  direction: "horizontal",
  validateEvent: true,
  ariaLabel: "发布环境",
  fill: "#1d4ed8",
  textColor: "#ffffff"
};

void radioGroupProps;

const radioButtonProps: RadioButtonProps = {
  modelValue,
  value: "prod",
  label: "生产环境",
  size: "md",
  name: "scene"
};

void radioButtonProps;

const invalidGroupProps: RadioGroupProps = {
  // @ts-expect-error invalid direction should be rejected
  direction: "grid"
};

void invalidGroupProps;
