import type { TableTreeProps } from "./table";

export const TABLE_DEFAULT_COLUMN_WIDTH = 160;
export const TABLE_SELECTION_COLUMN_WIDTH = 52;
export const TABLE_INDEX_COLUMN_WIDTH = 64;
export const TABLE_EXPAND_COLUMN_WIDTH = 56;
export const TABLE_DEFAULT_INDENT = 16;
export const TABLE_SUM_TEXT = "合计";

export const TABLE_DEFAULT_TREE_PROPS: Required<TableTreeProps> = {
  hasChildren: "hasChildren",
  children: "children",
  checkStrictly: false
};
