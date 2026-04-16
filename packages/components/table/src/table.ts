import type { Placement } from "@floating-ui/dom";
import type { StyleValue } from "vue";
import type { TooltipEffect, TooltipPopperOptions } from "../../tooltip";

export type TableAlign = "left" | "center" | "right";
export type TableSortOrder = "ascending" | "descending" | null;
export type TableSortable = boolean | "custom";
export type TableFilterValue = string | number | boolean;
export type TableFilterValues = Record<string, TableFilterValue[]>;
export type TableColumnType = "default" | "selection" | "index" | "expand";
export type TableColumnFixed = boolean | "left" | "right";
export type TableLayout = "fixed" | "auto";
export type TableSection = "main" | "left" | "right";
export type TableSummaryValue = string | number | boolean | null | undefined | unknown;
export type TableOverflowTooltip = boolean | TableOverflowTooltipOptions;

export interface TableOverflowTooltipOptions {
  effect?: TooltipEffect;
  enterable?: boolean;
  hideAfter?: number;
  offset?: number;
  placement?: Placement;
  popperClass?: string;
  popperOptions?: TooltipPopperOptions;
  showAfter?: number;
  showArrow?: boolean;
}

export interface TableFilterOption {
  text: string;
  value: TableFilterValue;
}

export interface TableSortState {
  prop?: string;
  order?: TableSortOrder;
}

export interface TableTreeProps {
  hasChildren?: string;
  children?: string;
  checkStrictly?: boolean;
}

export interface TableTreeNode {
  key: string | number;
  level: number;
  expanded: boolean;
  loading: boolean;
  loaded: boolean;
  hasChildren: boolean;
  isLazy: boolean;
  visible: boolean;
}

export interface TableHeaderSlotProps<T = Record<string, unknown>> {
  column: TableResolvedColumn<T>;
  sortOrder: TableSortOrder;
  filteredValues: TableFilterValue[];
}

export interface TableFilterIconSlotProps {
  filterOpened: boolean;
}

export interface TableCellSlotProps<T = Record<string, unknown>> {
  row: T;
  rowIndex: number;
  column: TableResolvedColumn<T>;
  columnIndex: number;
  value: unknown;
  expanded?: boolean;
  treeNode?: TableTreeNode;
}

export interface TableExpandSlotProps<T = Record<string, unknown>> extends TableCellSlotProps<T> {
  expanded: boolean;
  expandable: boolean;
}

export interface TableRowClassNameContext<T = Record<string, unknown>> {
  row: T;
  rowIndex: number;
}

export interface TableHeaderRowContext<T = Record<string, unknown>> {
  row: TableHeaderCell<T>[];
  rowIndex: number;
}

export interface TableHeaderCellContext<T = Record<string, unknown>> {
  row: TableHeaderCell<T>[];
  rowIndex: number;
  column: TableResolvedColumn<T>;
  columnIndex: number;
}

type TablePathKey<T> = Extract<keyof T, string>;
type TablePath<T> = T extends object
  ? {
      [K in TablePathKey<T>]:
        T[K] extends readonly unknown[]
          ? K
          : T[K] extends object
            ? K | `${K}.${TablePath<T[K]>}`
            : K;
    }[TablePathKey<T>]
  : never;

export type TableRowKey<T = Record<string, unknown>> =
  | TablePath<T>
  | ((row: T, rowIndex: number) => string | number);

export type TableRowClassName<T = Record<string, unknown>> =
  | string
  | ((row: T, rowIndex: number) => string)
  | ((context: TableRowClassNameContext<T>) => string);

export type TableRowStyle<T = Record<string, unknown>> =
  | StyleValue
  | ((row: T, rowIndex: number) => StyleValue)
  | ((context: TableRowClassNameContext<T>) => StyleValue);

export type TableCellClassName<T = Record<string, unknown>> =
  | string
  | ((props: TableCellSlotProps<T>) => string);

export type TableCellStyle<T = Record<string, unknown>> =
  | StyleValue
  | ((props: TableCellSlotProps<T>) => StyleValue);

export type TableHeaderRowClassName =
  | string
  | ((rowIndex: number) => string)
  | ((context: TableHeaderRowContext) => string);

export type TableHeaderRowStyle =
  | StyleValue
  | ((rowIndex: number) => StyleValue)
  | ((context: TableHeaderRowContext) => StyleValue);

export type TableHeaderCellClassName<T = Record<string, unknown>> =
  | string
  | ((column: TableResolvedColumn<T>, columnIndex: number) => string)
  | ((context: TableHeaderCellContext<T>) => string);

export type TableHeaderCellStyle<T = Record<string, unknown>> =
  | StyleValue
  | ((column: TableResolvedColumn<T>, columnIndex: number) => StyleValue)
  | ((context: TableHeaderCellContext<T>) => StyleValue);

export interface TableHeaderCell<T = Record<string, unknown>> {
  column: TableResolvedColumn<T>;
  colSpan: number;
  rowSpan: number;
  leafColumns: TableResolvedColumn<T>[];
  leafStartIndex: number;
}

export interface TableSpanMethodContext<T = Record<string, unknown>> {
  row: T;
  rowIndex: number;
  column: TableResolvedColumn<T>;
  columnIndex: number;
}

export interface TableSpanResult {
  rowspan: number;
  colspan: number;
}

export interface TableSummaryMethodContext<T = Record<string, unknown>> {
  columns: TableResolvedColumn<T>[];
  data: T[];
}

export interface TableBodyRow<T = Record<string, unknown>> {
  row: T;
  rowIndex: number;
  key: string | number;
  treeNode: TableTreeNode;
  expanded: boolean;
}

export interface TableColumnProps<T = Record<string, unknown>> {
  type?: TableColumnType;
  prop?: keyof T & string;
  property?: keyof T & string;
  label?: string;
  columnKey?: string;
  width?: string | number;
  minWidth?: string | number;
  align?: TableAlign;
  headerAlign?: TableAlign;
  className?: string;
  labelClassName?: string;
  formatter?: (row: T, column: TableResolvedColumn<T>, value: unknown, rowIndex: number) => unknown;
  renderHeader?: (props: TableHeaderSlotProps<T>) => unknown;
  sortable?: TableSortable;
  sortMethod?: (left: T, right: T) => number;
  sortBy?:
    | string
    | ((row: T, rowIndex: number, rows: T[]) => unknown)
    | Array<string | ((row: T, rowIndex: number, rows: T[]) => unknown)>;
  sortOrders?: TableSortOrder[];
  filters?: TableFilterOption[];
  filteredValue?: TableFilterValue[];
  filterMethod?: (value: TableFilterValue, row: T, column: TableResolvedColumn<T>) => boolean;
  filterMultiple?: boolean;
  filterPlacement?: Placement;
  filterClassName?: string;
  showOverflowTooltip?: TableOverflowTooltip;
  tooltipFormatter?: (
    context: TableCellSlotProps<T> & {
      cellValue: unknown;
    }
  ) => unknown;
  fixed?: TableColumnFixed;
  selectable?: (row: T, rowIndex: number) => boolean;
  reserveSelection?: boolean;
  index?: number | ((index: number) => number);
  resizable?: boolean;
}

export interface TableResolvedColumn<T = Record<string, unknown>> {
  uid: string;
  key: string;
  type: TableColumnType;
  prop?: string;
  label: string;
  columnKey?: string;
  width?: string | number;
  minWidth?: string | number;
  realWidth: number;
  align: TableAlign;
  headerAlign: TableAlign;
  className: string;
  labelClassName: string;
  formatter?: (row: T, column: TableResolvedColumn<T>, value: unknown, rowIndex: number) => unknown;
  renderHeader?: (props: TableHeaderSlotProps<T>) => unknown;
  sortable: TableSortable;
  sortMethod?: (left: T, right: T) => number;
  sortBy?:
    | string
    | ((row: T, rowIndex: number, rows: T[]) => unknown)
    | Array<string | ((row: T, rowIndex: number, rows: T[]) => unknown)>;
  sortOrders: TableSortOrder[];
  filters: TableFilterOption[];
  filteredValue?: TableFilterValue[];
  filterMethod?: (value: TableFilterValue, row: T, column: TableResolvedColumn<T>) => boolean;
  filterMultiple: boolean;
  filterPlacement?: Placement;
  filterClassName: string;
  showOverflowTooltip?: TableOverflowTooltip;
  tooltipFormatter?: (
    context: TableCellSlotProps<T> & {
      cellValue: unknown;
    }
  ) => unknown;
  overflowTooltipOptions: TableOverflowTooltipOptions | null;
  fixed?: "left" | "right";
  selectable?: (row: T, rowIndex: number) => boolean;
  reserveSelection: boolean;
  index?: number | ((index: number) => number);
  resizable: boolean;
  children: TableResolvedColumn<T>[];
  level: number;
  parentUid?: string;
  headerSlot?: (props: TableHeaderSlotProps<T>) => unknown;
  filterIconSlot?: (props: TableFilterIconSlotProps) => unknown;
  cellSlot?: (props: TableCellSlotProps<T>) => unknown;
  expandSlot?: (props: TableExpandSlotProps<T>) => unknown;
  leafCount: number;
  colSpan: number;
  rowSpan: number;
  leafIndex: number;
}

export interface TableProps<T = Record<string, unknown>> {
  data: T[];
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  fit?: boolean;
  stripe?: boolean;
  striped?: boolean;
  border?: boolean;
  bordered?: boolean;
  emptyText?: string;
  loadingText?: string;
  rowKey?: TableRowKey<T>;
  showHeader?: boolean;
  showSummary?: boolean;
  sumText?: string;
  summaryMethod?: (context: TableSummaryMethodContext<T>) => TableSummaryValue[];
  rowClassName?: TableRowClassName<T>;
  rowStyle?: TableRowStyle<T>;
  cellClassName?: TableCellClassName<T>;
  cellStyle?: TableCellStyle<T>;
  headerRowClassName?: TableHeaderRowClassName;
  headerRowStyle?: TableHeaderRowStyle;
  headerCellClassName?: TableHeaderCellClassName<T>;
  headerCellStyle?: TableHeaderCellStyle<T>;
  className?: string;
  style?: StyleValue;
  clickable?: boolean;
  highlightCurrentRow?: boolean;
  currentRowKey?: string | number | null;
  defaultCurrentRowKey?: string | number | null;
  sortProp?: string;
  sortOrder?: TableSortOrder;
  defaultSort?: TableSortState;
  filterValues?: TableFilterValues;
  defaultFilterValues?: TableFilterValues;
  expandRowKeys?: Array<string | number>;
  defaultExpandAll?: boolean;
  rowExpandable?: (row: T, index: number) => boolean;
  spanMethod?: (
    context: TableSpanMethodContext<T>
  ) => [number, number] | { rowspan: number; colspan: number } | undefined;
  selectOnIndeterminate?: boolean;
  indent?: number;
  treeProps?: TableTreeProps;
  lazy?: boolean;
  load?: (row: T, treeNode: TableTreeNode, resolve: (data: T[]) => void) => void;
  tableLayout?: TableLayout;
  scrollbarAlwaysOn?: boolean;
  scrollbarTabindex?: string | number;
  flexible?: boolean;
  nativeScrollbar?: boolean;
  showOverflowTooltip?: TableOverflowTooltip;
  tooltipEffect?: TooltipEffect;
  tooltipOptions?: TableOverflowTooltipOptions;
  tooltipFormatter?: (
    context: TableCellSlotProps<T> & {
      cellValue: unknown;
    }
  ) => unknown;
  appendFilterPanelTo?: string;
  allowDragLastColumn?: boolean;
  preserveExpandedContent?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}

export interface TableInstance<T = Record<string, unknown>> {
  columns: TableResolvedColumn<T>[];
  clearSelection: () => void;
  getSelectionRows: () => T[];
  toggleAllSelection: () => void;
  toggleRowSelection: (row: T, selected?: boolean, ignoreSelectable?: boolean) => void;
  toggleRowExpansion: (row: T, expanded?: boolean) => void;
  setCurrentRow: (row?: T | null) => void;
  clearSort: () => void;
  clearFilter: (columnKeys?: string | string[]) => void;
  sort: (prop: string, order: TableSortOrder) => void;
  doLayout: () => void;
  scrollTo: (options: ScrollToOptions | number, top?: number) => void;
  setScrollTop: (top: number) => void;
  setScrollLeft: (left: number) => void;
  updateKeyChildren: (key: string | number, children: T[]) => void;
}

export function normalizeSortOrders(value?: TableSortOrder[]) {
  if (!Array.isArray(value) || value.length === 0) {
    return ["ascending", "descending", null] as TableSortOrder[];
  }

  return value.filter(
    (item, index, source) =>
      (item === "ascending" || item === "descending" || item === null) &&
      source.indexOf(item) === index
  );
}

export function cloneFilterValues(value?: TableFilterValues) {
  const next: TableFilterValues = {};

  if (!value) {
    return next;
  }

  Object.entries(value).forEach(([key, values]) => {
    next[key] = Array.isArray(values) ? [...values] : [];
  });

  return next;
}

export function toCssSize(value: string | number): string;
export function toCssSize(value: undefined | null | ""): undefined;
export function toCssSize(value: string | number | undefined | null): string | undefined;
export function toCssSize(value: string | number | undefined | null) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return typeof value === "number" ? `${value}px` : value;
}

export function getColumnStateKey(column: Pick<TableResolvedColumn, "columnKey" | "prop">) {
  return column.columnKey ?? column.prop;
}

export function isPrimitiveTableValue(value: unknown): value is string | number | boolean {
  const type = typeof value;
  return type === "string" || type === "number" || type === "boolean";
}

export function normalizeFixed(value?: TableColumnFixed): "left" | "right" | undefined {
  if (value === true || value === "left") {
    return "left";
  }

  if (value === "right") {
    return "right";
  }

  return undefined;
}

export function toNumberSize(value: string | number | undefined, fallback = 160) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

export function prefersObjectCallbackSignature(callback: (...args: any[]) => any) {
  const source = callback.toString().trim();
  const arrowIndex = source.indexOf("=>");
  const paramsSource = arrowIndex >= 0 ? source.slice(0, arrowIndex).trim() : source;
  const normalized = paramsSource.startsWith("(") && paramsSource.endsWith(")")
    ? paramsSource.slice(1, -1).trim()
    : paramsSource;

  return normalized.startsWith("{");
}
