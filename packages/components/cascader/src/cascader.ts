import type Cascader from "./cascader.vue";
import type { StyleValue } from "vue";
import type { Placement } from "@floating-ui/dom";
import type { ComponentSize } from "@xiaoye/utils";

export type CascaderKey = string | number;
export type CascaderValue = CascaderKey[] | null;
export type CascaderOptionData = Record<string, any>;
export type CascaderValueChangeHandler = (value: CascaderValue) => void;
export type CascaderVisibleChangeHandler = (value: boolean) => void;
export type CascaderSearchChangeHandler = (value: string) => void;

export interface CascaderFieldNames {
  label?: string;
  value?: string;
  children?: string;
  disabled?: string;
  leaf?: string;
}

export type CascaderLoadFunction = (
  option: CascaderOptionData,
  resolve: (children: CascaderOptionData[]) => void
) => void;

export interface CascaderProps {
  modelValue?: CascaderValue;
  options: CascaderOptionData[];
  props?: CascaderFieldNames;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  lazy?: boolean;
  load?: CascaderLoadFunction;
  size?: ComponentSize;
  searchPlaceholder?: string;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  placement?: Placement;
  offset?: number;
  popperClass?: string;
  popperStyle?: StyleValue;
}

export type CascaderInstance = InstanceType<typeof Cascader>;
