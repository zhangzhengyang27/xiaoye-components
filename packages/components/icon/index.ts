import Icon from "./src/icon.vue";
import type { IconProps } from "./src/icon.vue";
import type { BuiltinIconName } from "./src/icons";
import { withInstall } from "@xiaoye/utils";

export type { IconProps, BuiltinIconName };

export const XyIcon = withInstall(Icon, "xy-icon");
export default XyIcon;
