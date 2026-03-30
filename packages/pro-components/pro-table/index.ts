import ProTable from "./src/pro-table.vue";
import type {
  ProTableColumn,
  ProTableInstance,
  ProTableProps
} from "./src/pro-table";
import { withInstall } from "@xiaoye/utils";

export type {
  ProTableColumn,
  ProTableInstance,
  ProTableProps
};

export const XyProTable = withInstall(ProTable, "xy-pro-table");

export default XyProTable;
