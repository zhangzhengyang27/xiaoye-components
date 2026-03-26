import Tree from "./src/tree.vue";
import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import type { TreeProps } from "./src/tree";
import type {
  AllowDragFunction,
  AllowDropFunction,
  CheckedInfo,
  NodeDropType,
  RenderContentContext,
  TreeData,
  TreeDragPayload,
  TreeExposes,
  TreeKey,
  TreeNodeData,
  TreeOptionProps
} from "./src/tree.type";
import type { TreeInstance } from "./src/instance";

export type {
  AllowDragFunction,
  AllowDropFunction,
  CheckedInfo,
  NodeDropType,
  RenderContentContext,
  TreeData,
  TreeDragPayload,
  TreeExposes,
  TreeInstance,
  TreeKey,
  TreeNodeData,
  TreeOptionProps,
  TreeProps
};

export const XyTree = withInstall(Tree, "xy-tree") as SFCWithInstall<typeof Tree>;

export default XyTree;
