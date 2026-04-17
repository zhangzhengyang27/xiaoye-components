import TreeSelect from "./src/tree-select.vue";
import type {
  TreeSelectInstance,
  TreeSelectProps,
  TreeSelectValueChangeHandler,
  TreeSelectVisibleChangeHandler
} from "./src/tree-select";
import { withInstall } from "@xiaoye/utils";

export type {
  TreeSelectInstance,
  TreeSelectProps,
  TreeSelectValueChangeHandler,
  TreeSelectVisibleChangeHandler
};

export const XyTreeSelect = withInstall(TreeSelect, "xy-tree-select");
export default XyTreeSelect;
