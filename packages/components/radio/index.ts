import Radio from "./src/radio.vue";
import RadioButton from "./src/radio-button.vue";
import RadioGroup from "./src/radio-group.vue";
import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import type {
  RadioGroupDirection,
  RadioGroupOptionSlotProps,
  RadioGroupProps,
  RadioOption
} from "./src/radio-group";
import type { RadioButtonProps } from "./src/radio-button";
import type { RadioProps, RadioValue, RadioValueChangeHandler } from "./src/radio";

export type {
  RadioButtonProps,
  RadioGroupDirection,
  RadioGroupOptionSlotProps,
  RadioGroupProps,
  RadioOption,
  RadioProps,
  RadioValue,
  RadioValueChangeHandler
};

export const XyRadioGroup = withInstall(RadioGroup, "xy-radio-group");
export const XyRadioButton = withInstall(RadioButton, "xy-radio-button");

export const XyRadio = withInstall(Radio, "xy-radio") as SFCWithInstall<typeof Radio> & {
  Group: typeof XyRadioGroup;
  Button: typeof XyRadioButton;
};

XyRadio.Group = XyRadioGroup;
XyRadio.Button = XyRadioButton;

export default XyRadio;
