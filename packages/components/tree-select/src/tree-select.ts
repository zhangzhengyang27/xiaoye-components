import type { StyleValue } from "vue";
import type { Placement } from "@floating-ui/dom";
import type { ComponentSize } from "@xiaoye/utils";
import type { TreeData, TreeKey, TreeOptionProps } from "../../tree";
import type { FilterNodeMethodFunction, LoadFunction } from "../../tree/src/tree.type";

export interface TreeSelectProps {
  modelValue?: TreeKey | null;
  data?: TreeData;
  nodeKey?: string;
  props?: TreeOptionProps;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  filterNodeMethod?: FilterNodeMethodFunction;
  lazy?: boolean;
  load?: LoadFunction;
  size?: ComponentSize;
  emptyText?: string;
  searchPlaceholder?: string;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  placement?: Placement;
  offset?: number;
  popperClass?: string;
  popperStyle?: StyleValue;
}
