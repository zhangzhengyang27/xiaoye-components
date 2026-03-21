import Icon from "./src/icon.vue";
import type { IconProps } from "./src/icon.vue";
import { withInstall } from "@xiaoye/utils";

export type { IconProps };

export const XyIcon = withInstall(Icon, "xy-icon");
export default XyIcon;
