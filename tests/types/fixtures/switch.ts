import type { SwitchProps, SwitchValue } from "xiaoye-components";

const value: SwitchValue = true;

const switchProps: SwitchProps = {
  modelValue: value,
  disabled: false,
  loading: false,
  size: "md",
  width: 48,
  inlinePrompt: true,
  inactiveActionIcon: "mdi:close",
  activeActionIcon: "mdi:check",
  activeIcon: "mdi:eye-outline",
  inactiveIcon: "mdi:eye-off-outline",
  activeText: "开启",
  inactiveText: "关闭",
  activeValue: true,
  inactiveValue: false,
  name: "published",
  validateEvent: true,
  beforeChange: () => true,
  id: "publish-switch",
  tabindex: 0,
  ariaLabel: "发布开关"
};

void switchProps;

const invalidValue: SwitchProps = {
  // @ts-expect-error invalid object value should be rejected
  modelValue: { enabled: true }
};

void invalidValue;
