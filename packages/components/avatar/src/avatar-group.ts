import type { ComponentSize } from "@xiaoye/utils";
import type { StyleValue } from "vue";
import type { TooltipProps } from "../../tooltip";
import type { AvatarFit, AvatarProps, AvatarShape } from "./avatar";

export interface AvatarGroupItem {
  key?: string | number;
  text?: string;
  icon?: string;
  src?: string;
  alt?: string;
  srcSet?: string;
  fit?: AvatarFit;
  size?: AvatarProps["size"];
  shape?: AvatarShape;
  className?: string;
  style?: StyleValue;
}

export interface AvatarGroupProps {
  size?: number | ComponentSize;
  shape?: AvatarShape;
  items?: AvatarGroupItem[];
  direction?: "horizontal" | "vertical";
  gutter?: number;
  reverse?: boolean;
  inline?: boolean;
  collapseAvatars?: boolean;
  collapseAvatarsTooltip?: boolean;
  maxCollapseAvatars?: number;
  placement?: TooltipProps["placement"];
  collapseClass?: string;
  collapseStyle?: StyleValue;
}
