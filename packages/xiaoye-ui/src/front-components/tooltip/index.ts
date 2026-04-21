import { withInstall } from "xiaoye-primitives";
import Tooltip from "./tooltip.vue";
import type { TooltipProps, TooltipInstance, TooltipPlacement, TooltipTrigger } from "./tooltip";

export type { TooltipProps, TooltipInstance, TooltipPlacement, TooltipTrigger };

export const XyuTooltip = withInstall(Tooltip, "XyuTooltip");

export default XyuTooltip;
