import Tree from "./src/tree.vue";
import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import type { TreeProps } from "./src/tree";
import type {
  CheckedInfo,
  RenderContentContext,
  TreeData,
  TreeExposes,
  TreeKey,
  TreeNodeData,
  TreeOptionProps
} from "./src/tree.type";
import type { TreeInstance } from "./src/instance";

export type {
  CheckedInfo,
  RenderContentContext,
  TreeData,
  TreeExposes,
  TreeInstance,
  TreeKey,
  TreeNodeData,
  TreeOptionProps,
  TreeProps
};

export const XyTree = withInstall(Tree, "xy-tree") as SFCWithInstall<typeof Tree>;

export default XyTree;
