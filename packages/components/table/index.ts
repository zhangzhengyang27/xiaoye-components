import Table from "./src/table.vue";
import type { TableProps, TableColumn } from "./src/table.vue";
import { withInstall } from "@xiaoye/utils";

export type { TableProps, TableColumn };
export type TableRow = object;
type RuntimeTableRow = Record<string, unknown>;

export function defineTableProps<T extends TableRow>(
  props: TableProps<T>
): TableProps<RuntimeTableRow> {
  return props as TableProps<RuntimeTableRow>;
}

export function defineTableColumns<T extends TableRow>(columns: TableColumn<T>[]) {
  return columns;
}

export const XyTable = withInstall(Table, "xy-table");

export default XyTable;
