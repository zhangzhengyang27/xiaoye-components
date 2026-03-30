import TableFilterDrawer from "./src/table-filter-drawer.vue";
import type { TableFilterDrawerProps } from "./src/table-filter-drawer";
import { withInstall } from "@xiaoye/utils";

export type { TableFilterDrawerProps };

export const XyTableFilterDrawer = withInstall(
  TableFilterDrawer,
  "xy-table-filter-drawer"
);

export default XyTableFilterDrawer;
