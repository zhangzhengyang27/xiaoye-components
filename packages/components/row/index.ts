import Row from "./src/row.vue";
import type { RowAlign, RowJustify, RowProps } from "./src/row";
import { withInstall } from "@xiaoye/primitives";

export type { RowAlign, RowJustify, RowProps };

export const XyRow = withInstall(Row, "xy-row");
export default XyRow;
