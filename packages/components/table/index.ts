import Table from "./src/table.vue";
import TableColumn from "./src/table-column.vue";
import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import type {
  TableAlign,
  TableCellClassName,
  TableCellSlotProps,
  TableCellStyle,
  TableBodyRow,
  TableColumnProps,
  TableFilterOption,
  TableFilterValue,
  TableFilterValues,
  TableHeaderSlotProps,
  TableHeaderCell,
  TableHeaderCellClassName,
  TableHeaderCellStyle,
  TableHeaderRowClassName,
  TableHeaderRowStyle,
  TableInstance,
  TableOverflowTooltip,
  TableOverflowTooltipOptions,
  TableProps,
  TableResolvedColumn,
  TableRowClassName,
  TableRowKey,
  TableRowStyle,
  TableSection,
  TableSummaryMethodContext,
  TableSummaryValue,
  TableSortOrder,
  TableSortState,
  TableSortable,
  TableSpanMethodContext,
  TableSpanResult,
  TableTreeNode,
  TableTreeProps
} from "./src/table";

export type {
  TableAlign,
  TableCellClassName,
  TableCellSlotProps,
  TableCellStyle,
  TableBodyRow,
  TableColumnProps,
  TableFilterOption,
  TableFilterValue,
  TableFilterValues,
  TableHeaderSlotProps,
  TableHeaderCell,
  TableHeaderCellClassName,
  TableHeaderCellStyle,
  TableHeaderRowClassName,
  TableHeaderRowStyle,
  TableInstance,
  TableOverflowTooltip,
  TableOverflowTooltipOptions,
  TableProps,
  TableResolvedColumn,
  TableRowClassName,
  TableRowKey,
  TableRowStyle,
  TableSection,
  TableSummaryMethodContext,
  TableSummaryValue,
  TableSortOrder,
  TableSortState,
  TableSortable,
  TableSpanMethodContext,
  TableSpanResult,
  TableTreeNode,
  TableTreeProps
};

export const XyTableColumn = withInstall(TableColumn, "xy-table-column");

export const XyTable = withInstall(Table, "xy-table") as SFCWithInstall<typeof Table> & {
  Column: typeof XyTableColumn;
};

XyTable.Column = XyTableColumn;

export default XyTable;
