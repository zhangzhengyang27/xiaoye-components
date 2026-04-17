import Switch from "./src/switch.vue";
import type {
  SwitchFocusHandler,
  SwitchInstance,
  SwitchProps,
  SwitchValue,
  SwitchValueChangeHandler
} from "./src/switch";
import { withInstall } from "@xiaoye/utils";

export type {
  SwitchFocusHandler,
  SwitchInstance,
  SwitchProps,
  SwitchValue,
  SwitchValueChangeHandler
};

export const XySwitch = withInstall(Switch, "xy-switch");
export default XySwitch;
