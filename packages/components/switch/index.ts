import Switch from "./src/switch.vue";
import type { SwitchProps, SwitchValue } from "./src/switch";
import { withInstall } from "@xiaoye/utils";

export type { SwitchProps, SwitchValue };

export const XySwitch = withInstall(Switch, "xy-switch");
export default XySwitch;
