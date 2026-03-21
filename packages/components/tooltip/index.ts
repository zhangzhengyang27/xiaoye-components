import Tooltip from "./src/tooltip.vue";
import type { TooltipProps } from "./src/tooltip.vue";
import { withInstall } from "@xiaoye/utils";

export type { TooltipProps };

export const XyTooltip = withInstall(Tooltip, "xy-tooltip");
export default XyTooltip;
