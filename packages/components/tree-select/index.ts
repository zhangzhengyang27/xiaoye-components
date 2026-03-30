import TreeSelect from "./src/tree-select.vue";
import type { TreeSelectProps } from "./src/tree-select";
import { withInstall } from "@xiaoye/utils";

export type { TreeSelectProps };

export const XyTreeSelect = withInstall(TreeSelect, "xy-tree-select");
export default XyTreeSelect;
