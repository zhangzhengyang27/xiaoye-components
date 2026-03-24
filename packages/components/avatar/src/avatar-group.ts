import type { ComponentSize } from "@xiaoye/utils";
import type { StyleValue } from "vue";
import type { TooltipProps } from "../../tooltip";
import type { AvatarShape } from "./avatar";

export interface AvatarGroupProps {
  size?: number | ComponentSize;
  shape?: AvatarShape;
  collapseAvatars?: boolean;
  collapseAvatarsTooltip?: boolean;
  maxCollapseAvatars?: number;
  placement?: TooltipProps["placement"];
  collapseClass?: string;
  collapseStyle?: StyleValue;
}
