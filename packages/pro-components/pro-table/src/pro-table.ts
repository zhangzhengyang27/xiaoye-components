import type { Component, VNodeChild } from "vue";
import type {
  ButtonType,
  PaginationProps,
  TableCellSlotProps,
  TableColumnFixed,
  TableColumnProps,
  TableFilterValues,
  TableHeaderSlotProps,
  TableInstance,
  TableProps,
  TableResolvedColumn,
  TableSortOrder
} from "@xiaoye/components";
import type { SelectOption } from "@xiaoye/primitives";
import type { SelectOptionGroup } from "@xiaoye/components";
import type { ComponentStatus } from "@xiaoye/primitives";
import type { SearchFormField } from "../../search-form";
import type { ProFieldSchema, ProFieldSchemaBuiltinComponent, ProRequestContext, ProRequestResult } from "../../core";

export type ProTableRow = Record<string, unknown>;
export type ProTableCellSlotProps<T = ProTableRow> = TableCellSlotProps<T>;
export type ProTableHeaderSlotProps<T = ProTableRow> = TableHeaderSlotProps<T>;
export type ProTableDensity = NonNullable<TableProps["size"]>;
export type ProTableEditableMode = "table" | "row" | "cell";
export type ProTableEditableTrigger = "click" | "dblclick" | "manual";
export type ProTableSelectionMode = "single" | "multiple";
export type ProTableContextmenuScope = "row" | "cell" | "header";
export type ProTableExportType = "csv" | "excel";

export interface ProTableToolbarAction {
  key: string;
  label: string;
  type?: ButtonType;
  plain?: boolean;
  text?: boolean;
  link?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  visible?: boolean;
}

export interface ProTableBatchAction {
  key: string;
  label: string;
  type?: ButtonType;
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  visible?: boolean;
}

export interface ProTableSavedViewItem {
  key: string;
  label: string;
  count?: number;
  closable?: boolean;
}

export interface ProTableContextmenuItem<T = ProTableRow> {
  key: string;
  label: string;
  icon?: string;
  danger?: boolean;
  disabled?: boolean;
  visible?: boolean;
  handler?: (context: ProTableContextmenuPayload<T>) => void;
}

export interface ProTableContextmenuPayload<T = ProTableRow> {
  scope: ProTableContextmenuScope;
  row?: T;
  column?: TableResolvedColumn<T>;
  cell?: HTMLTableCellElement;
  event: MouseEvent;
}

export interface ProTableExportPayload<T = ProTableRow> {
  type: ProTableExportType;
  filename: string;
  columns: ProTableColumn<T>[];
  rows: T[];
}

export interface ProTableEditorSchema<T = ProTableRow> {
  component?: ProFieldSchemaBuiltinComponent | Component;
  componentProps?: Record<string, unknown> | ((row: T) => Record<string, unknown>);
  options?: Array<SelectOption | SelectOptionGroup> | ((row: T) => Array<SelectOption | SelectOptionGroup>);
  placeholder?: string;
}

export interface ProTableDisplayOption extends SelectOption {
  status?: ComponentStatus | "info";
  color?: string;
}

export interface ProTableDisplayOptionGroup extends Omit<SelectOptionGroup, "options"> {
  options: ProTableDisplayOption[];
}

export interface ProTableColumn<T = ProTableRow> extends TableColumnProps<T> {
  key?: string;
  children?: ProTableColumn<T>[];
  slot?: string;
  headerSlot?: string;
  hidden?: boolean;
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
  formatter?: (
    row: T,
    column: TableResolvedColumn<T>,
    value: unknown,
    rowIndex: number
  ) => unknown;
  render?: (
    value: unknown,
    context: {
      row: T;
      column: ProTableColumn<T>;
      rowIndex: number;
    }
  ) => VNodeChild;
  renderHTML?: (
    value: unknown,
    context: {
      row: T;
      column: ProTableColumn<T>;
      rowIndex: number;
    }
  ) => string;
  emptyValue?: string;
  editable?: boolean | ((row: T, rowIndex: number) => boolean);
  editor?: ProFieldSchemaBuiltinComponent | Component;
  editorProps?: Record<string, unknown> | ((row: T) => Record<string, unknown>);
  editorSlot?: string;
  options?:
    | Array<ProTableDisplayOption | ProTableDisplayOptionGroup>
    | ((row: T) => Array<ProTableDisplayOption | ProTableDisplayOptionGroup>);
  exportable?: boolean;
  printable?: boolean;
}

export interface ProTableWorkbenchConfig {
  refresh?: boolean;
  density?: boolean;
  columnSetting?: boolean;
  fullscreen?: boolean;
  treeToggle?: boolean;
  filter?: boolean;
  export?: boolean;
  print?: boolean;
  defaultDensity?: ProTableDensity;
}

export interface ProTableRequestConfig<T = ProTableRow> {
  request: (params: Record<string, unknown>, ctx: ProRequestContext) => Promise<ProRequestResult<T>>;
  requestParams?: Record<string, unknown>;
  immediate?: boolean;
  autoReloadOnParamsChange?: boolean;
}

export interface ProTableViewsConfig {
  searchModel?: Record<string, unknown>;
  searchFields?: SearchFormField[];
  savedViews?: ProTableSavedViewItem[];
  activeViewKey?: string;
  filterModel?: Record<string, unknown>;
  filterFields?: ProFieldSchema[];
  filterTitle?: string;
}

export interface ProTableTableSelectConfig {
  enabled?: boolean;
  mode?: ProTableSelectionMode;
  title?: string;
  description?: string;
  confirmText?: string;
  clearText?: string;
}

export interface ProTableEditableConfig<T = ProTableRow> {
  enabled?: boolean;
  mode?: ProTableEditableMode;
  trigger?: ProTableEditableTrigger;
  autoSave?: boolean;
  canEditRow?: (row: T, rowIndex: number) => boolean;
}

export interface ProTableVirtualConfig {
  enabled?: boolean;
  itemSize: number;
  overscan?: number;
  height?: string | number;
}

export interface ProTableContextmenuConfig<T = ProTableRow> {
  rowItems?: ProTableContextmenuItem<T>[];
  cellItems?: ProTableContextmenuItem<T>[];
  headerItems?: ProTableContextmenuItem<T>[];
  getItems?: (context: ProTableContextmenuPayload<T>) => ProTableContextmenuItem<T>[];
}

export interface ProTableExportOptions<T = ProTableRow> {
  filename?: string;
  defaultType?: ProTableExportType;
  types?: ProTableExportType[];
  mapRow?: (row: T) => Record<string, unknown>;
  beforeExport?: (payload: ProTableExportPayload<T>) => boolean | Promise<boolean>;
}

export interface ProTablePrintOptions<T = ProTableRow> {
  title?: string;
  subtitle?: string;
  beforePrint?: (rows: T[]) => boolean | Promise<boolean>;
}

export interface ProTableInstance<T = ProTableRow> extends TableInstance<T> {
  refreshLayout: () => void;
  reload: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => Promise<void>;
  toggleFullscreen: (force?: boolean) => Promise<void>;
  setDensity: (density: ProTableDensity) => void;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
  getVisibleColumns: () => ProTableColumn<T>[];
  startEdit: (
    row?: T | null,
    column?: ProTableColumn<T> | TableResolvedColumn<T> | string | null
  ) => void;
  cancelEdit: (row?: T | null) => void;
  submitEdit: (row?: T | null) => void;
}

export interface ProTableProps<T = ProTableRow> {
  title?: string;
  description?: string;
  data: T[];
  columns: ProTableColumn<T>[];
  loading?: boolean;
  draggableRow?: boolean;
  draggableColumn?: boolean;
  toolbarActions?: ProTableToolbarAction[];
  tableProps?: Omit<Partial<TableProps<T>>, "data" | "loading">;
  pagination?: boolean;
  currentPage?: number;
  pageSize?: number;
  defaultCurrentPage?: number;
  defaultPageSize?: number;
  total?: number;
  pageSizes?: number[];
  pageLayout?: string;
  hideOnSinglePage?: boolean;
  paginationProps?: Partial<PaginationProps>;
  workbench?: ProTableWorkbenchConfig;
  request?: ProTableRequestConfig<T>;
  views?: ProTableViewsConfig;
  batchActions?: ProTableBatchAction[];
  tableSelect?: ProTableTableSelectConfig;
  editable?: ProTableEditableConfig<T>;
  virtual?: ProTableVirtualConfig;
  contextmenu?: ProTableContextmenuConfig<T>;
  exportOptions?: ProTableExportOptions<T>;
  printOptions?: ProTablePrintOptions<T>;
}

export interface ProTableSortChangePayload<T = ProTableRow> {
  column: TableResolvedColumn<T>;
  prop: string | undefined;
  order: TableSortOrder;
}

export type ProTableFilterChangePayload = TableFilterValues;

export function getProTableColumnKey<T = ProTableRow>(
  column: Pick<
    ProTableColumn<T>,
    "key" | "prop" | "columnKey" | "label"
  >
) {
  return column.key ?? column.columnKey ?? column.prop ?? column.label ?? "";
}

export function isColumnVisible<T = ProTableRow>(column: ProTableColumn<T>) {
  return column.hidden !== true;
}

export function flattenProTableColumns<T = ProTableRow>(
  columns: ProTableColumn<T>[]
): ProTableColumn<T>[] {
  return columns.flatMap((column) =>
    column.children?.length ? flattenProTableColumns(column.children) : [column]
  );
}

export function cloneProTableColumns<T = ProTableRow>(
  columns: ProTableColumn<T>[]
): ProTableColumn<T>[] {
  return columns.map((column) => ({
    ...column,
    children: column.children ? cloneProTableColumns(column.children) : undefined
  }));
}

export function resolveVisibleProTableColumns<T = ProTableRow>(
  columns: ProTableColumn<T>[]
): ProTableColumn<T>[] {
  return columns
    .filter((column) => isColumnVisible(column))
    .map((column) => ({
      ...column,
      children: column.children ? resolveVisibleProTableColumns(column.children) : undefined
    }));
}

export function applyColumnVisibility<T = ProTableRow>(
  columns: ProTableColumn<T>[],
  visibleKeys: Set<string>
): ProTableColumn<T>[] {
  return columns.map((column) => {
    const columnKey = getProTableColumnKey(column);
    const children: ProTableColumn<T>[] | undefined = column.children
      ? applyColumnVisibility(column.children, visibleKeys)
      : undefined;

    if (children?.length) {
      const visibleChildren = children.some((item: ProTableColumn<T>) => item.hidden !== true);
      return {
        ...column,
        hidden: !visibleChildren,
        children
      };
    }

    return {
      ...column,
      hidden: !visibleKeys.has(columnKey)
    };
  });
}

export function applyColumnFixed<T = ProTableRow>(
  columns: ProTableColumn<T>[],
  key: string,
  fixed?: TableColumnFixed
): ProTableColumn<T>[] {
  return columns.map((column) => {
    const columnKey = getProTableColumnKey(column);

    if (column.children?.length) {
      return {
        ...column,
        children: applyColumnFixed(column.children, key, fixed)
      };
    }

    if (columnKey !== key) {
      return column;
    }

    return {
      ...column,
      fixed
    };
  });
}
