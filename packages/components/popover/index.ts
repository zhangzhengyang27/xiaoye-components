import Popover from "./src/popover.vue";
import type {
  PopoverDefaultSlotProps,
  PopoverModelValueChangeHandler,
  PopoverProps,
  PopoverTrigger
} from "./src/popover.vue";
import { withInstall } from "@xiaoye/utils";

export type {
  PopoverDefaultSlotProps,
  PopoverModelValueChangeHandler,
  PopoverProps,
  PopoverTrigger
};

export const XyPopover = withInstall(Popover, "xy-popover");
export default XyPopover;
