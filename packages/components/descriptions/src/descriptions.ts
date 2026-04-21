import type { VNodeChild } from "vue";
import type { SelectOptionGroup } from "../../select";
import type { ComponentSize, ComponentStatus } from "@xiaoye/primitives";
import type { SelectOption } from "@xiaoye/primitives";
import type { LinkProps } from "../../link";
import type { TagProps } from "../../tag";

export interface DescriptionsDataTag {
  text: string;
  props?: TagProps;
}

export interface DescriptionsDisplayOption extends SelectOption {
  status?: ComponentStatus | "info";
  color?: string;
}

export interface DescriptionsDisplayOptionGroup extends Omit<SelectOptionGroup, "options"> {
  options: DescriptionsDisplayOption[];
}

export interface DescriptionsDataItem {
  label: string;
  value?: unknown;
  row?: Record<string, unknown>;
  span?: number;
  icon?: string;
  tag?: string | DescriptionsDataTag;
  link?: LinkProps;
  valueType?:
    | "text"
    | "select"
    | "radio"
    | "checkbox"
    | "tag"
    | "progress"
    | "link"
    | "image"
    | "avatar"
    | "money"
    | "date"
    | "datetime"
    | "code"
    | "copy";
  options?: Array<DescriptionsDisplayOption | DescriptionsDisplayOptionGroup>;
  formatter?: (
    row: Record<string, unknown>,
    column: DescriptionsDataItem,
    value: unknown,
    rowIndex: number
  ) => unknown;
  render?: (
    value: unknown,
    context: {
      row: Record<string, unknown>;
      column: DescriptionsDataItem;
      rowIndex: number;
    }
  ) => VNodeChild;
  renderHTML?: (
    value: unknown,
    context: {
      row: Record<string, unknown>;
      column: DescriptionsDataItem;
      rowIndex: number;
    }
  ) => string;
  emptyValue?: string;
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
