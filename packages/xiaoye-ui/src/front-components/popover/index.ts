import { withInstall } from "xiaoye-primitives";
import Popover from "./popover.vue";
import type { PopoverProps, PopoverEmits, PopoverInstance, PopoverPlacement, PopoverTrigger } from "./popover";

export type { PopoverProps, PopoverEmits, PopoverInstance, PopoverPlacement, PopoverTrigger };

export const XyuPopover = withInstall(Popover, "XyuPopover");

export default XyuPopover;
