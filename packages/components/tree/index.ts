import Tree from "./src/tree.vue";
import type { SFCWithInstall } from "@xiaoye/primitives";
import { withInstall } from "@xiaoye/primitives";
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
import type {
  TreeCheckChangeHandler,
  TreeCheckHandler,
  TreeCurrentChangeHandler,
  TreeNodeClickHandler,
  TreeNodeCollapseHandler,
  TreeNodeContextmenuHandler,
  TreeNodeDragEndHandler,
  TreeNodeDragEnterHandler,
  TreeNodeDragLeaveHandler,
  TreeNodeDragOverHandler,
  TreeNodeDragStartHandler,
  TreeNodeDropHandler,
  TreeNodeExpandHandler
} from "./src/tree";

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
  TreeCheckChangeHandler,
  TreeCheckHandler,
  TreeNodeData,
  TreeCurrentChangeHandler,
  TreeNodeClickHandler,
  TreeNodeCollapseHandler,
  TreeNodeContextmenuHandler,
  TreeNodeDragEndHandler,
  TreeNodeDragEnterHandler,
  TreeNodeDragLeaveHandler,
  TreeNodeDragOverHandler,
  TreeNodeDragStartHandler,
  TreeNodeDropHandler,
  TreeNodeExpandHandler,
  TreeOptionProps,
  TreeProps
};

export const XyTree = withInstall(Tree, "xy-tree") as SFCWithInstall<typeof Tree>;

export default XyTree;
