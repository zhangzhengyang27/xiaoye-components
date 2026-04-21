import { withInstall } from "xiaoye-primitives";
import Switch from "./switch.vue";
import type { SwitchProps, SwitchInstance, SwitchSize } from "./switch";

export type { SwitchProps, SwitchInstance, SwitchSize };

export const XyuSwitch = withInstall(Switch, "XyuSwitch");

export default XyuSwitch;
