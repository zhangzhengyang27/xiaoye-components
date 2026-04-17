import Tooltip from "./src/tooltip.vue";
import type {
  TooltipEffect,
  TooltipExposed,
  TooltipModelValueChangeHandler,
  TooltipPopperOptions,
  TooltipProps,
  TooltipTrigger
} from "./src/tooltip";
import { withInstall } from "@xiaoye/utils";

export type {
  TooltipEffect,
  TooltipExposed,
  TooltipModelValueChangeHandler,
  TooltipPopperOptions,
  TooltipProps,
  TooltipTrigger
};

export const XyTooltip = withInstall(Tooltip, "xy-tooltip");
export default XyTooltip;
