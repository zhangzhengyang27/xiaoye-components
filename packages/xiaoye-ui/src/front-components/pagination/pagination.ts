export type PaginationLayout =
  | "prev"
  | "pager"
  | "next"
  | "size"
  | "total"
  | "jumper"
  | "->";

export interface PaginationProps {
  modelValue?: number;
  pageSize?: number;
  total?: number;
  pageCount?: number;
  pagerCount?: number;
  layout?: string;
  prevText?: string;
  nextText?: string;
  background?: boolean;
  small?: boolean;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
}

export interface PaginationEmits {
  (e: "update:modelValue", value: number): void;
  (e: "update:pageSize", value: number): void;
  (e: "change", current: number, prev: number): void;
  (e: "page-size-change", pageSize: number): void;
}

export interface PagerProps {
  page: number;
  current: number;
  active?: boolean;
  disabled?: boolean;
}

export type PaginationInstance = InstanceType<import("./pagination.vue").default>;
export type PagerInstance = InstanceType<import("./pager.vue").default>;
