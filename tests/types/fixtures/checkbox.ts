import type {
  CheckboxButtonProps,
  CheckboxGroupProps,
  CheckboxGroupValue,
  CheckboxProps,
  CheckboxValue
} from "xiaoye-components";

const checkboxValue: CheckboxValue = true;
const checkboxGroupValue: CheckboxGroupValue = ["api"];

const checkboxProps: CheckboxProps = {
  modelValue: checkboxValue,
  value: "notify",
  label: "接收通知",
  indeterminate: false,
  disabled: false,
  checked: true,
  name: "notify",
  trueValue: 1,
  falseValue: 0,
  border: true,
  size: "md",
  tabindex: 0,
  validateEvent: true,
  ariaLabel: "通知复选框",
  ariaControls: "notify-panel"
};

void checkboxProps;

const checkboxGroupProps: CheckboxGroupProps = {
  modelValue: checkboxGroupValue,
  options: [{ label: "API", value: "api" }],
  type: "button",
  disabled: false,
  size: "md",
  name: "scopes",
  direction: "horizontal",
  validateEvent: true,
  ariaLabel: "权限范围",
  fill: "#1d4ed8",
  textColor: "#ffffff",
  min: 1,
  max: 3
};

void checkboxGroupProps;

const checkboxButtonProps: CheckboxButtonProps = {
  modelValue: "day",
  value: "week",
  label: "按周",
  disabled: false,
  size: "sm",
  name: "dimension"
};

void checkboxButtonProps;

const invalidCheckboxGroup: CheckboxGroupProps = {
  // @ts-expect-error invalid direction should be rejected
  direction: "grid"
};

void invalidCheckboxGroup;
