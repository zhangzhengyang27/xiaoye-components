import FrontPopover from "./src/front-popover.vue";
import type { FrontPopoverProps, FrontPopoverSurface } from "./src/popover";
import { withInstall } from "@xiaoye/utils";

export type { FrontPopoverProps, FrontPopoverSurface };

export const XyFrontPopover = withInstall(FrontPopover, "xy-front-popover");
export default XyFrontPopover;
