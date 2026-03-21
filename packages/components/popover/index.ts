import Popover from "./src/popover.vue";
import type { PopoverProps } from "./src/popover.vue";
import { withInstall } from "@xiaoye/utils";

export type { PopoverProps };

export const XyPopover = withInstall(Popover, "xy-popover");
export default XyPopover;

