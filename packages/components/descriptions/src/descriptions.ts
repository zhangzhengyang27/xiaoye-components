import type { ComponentSize } from "@xiaoye/utils";
import type { LinkProps } from "../../link";
import type { TagProps } from "../../tag";

export interface DescriptionsDataTag {
  text: string;
  props?: TagProps;
}

export interface DescriptionsDataItem {
  label: string;
  value?: string | number;
  span?: number;
  icon?: string;
  tag?: string | DescriptionsDataTag;
  link?: LinkProps;
  className?: string;
  labelClassName?: string;
  contentClassName?: string;
  labelSlot?: string;
  defaultSlot?: string;
}

export interface DescriptionsProps {
  column?: number;
  border?: boolean;
  size?: ComponentSize;
  title?: string;
  extra?: string;
  labelWidth?: string | number;
  direction?: "horizontal" | "vertical";
  collapse?: boolean;
  items?: DescriptionsDataItem[];
}
