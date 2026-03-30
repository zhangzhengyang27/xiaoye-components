import type {
  ButtonType,
  PaginationProps,
  TableCellSlotProps,
  TableColumnProps,
  TableFilterValues,
  TableHeaderSlotProps,
  TableInstance,
  TableProps,
  TableResolvedColumn,
  TableSortOrder
} from "@xiaoye/components";

export type ProTableRow = Record<string, unknown>;
export type ProTableCellSlotProps<T = ProTableRow> = TableCellSlotProps<T>;
export type ProTableHeaderSlotProps<T = ProTableRow> = TableHeaderSlotProps<T>;

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

export interface ProTableColumn<T = ProTableRow> extends TableColumnProps<T> {
  key?: string;
  children?: ProTableColumn<T>[];
  slot?: string;
  headerSlot?: string;
  hidden?: boolean;
}

export interface ProTableProps<T = ProTableRow> {
  title?: string;
  description?: string;
  data: T[];
  columns: ProTableColumn<T>[];
  loading?: boolean;
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
}

export interface ProTableInstance<T = ProTableRow> extends TableInstance<T> {
  refreshLayout: () => void;
}

export interface ProTableSortChangePayload<T = ProTableRow> {
  column: TableResolvedColumn<T>;
  prop: string | undefined;
  order: TableSortOrder;
}

export type ProTableFilterChangePayload = TableFilterValues;
