import type { Component, ComponentInternalInstance, PropType } from "vue";
import type Node from "./model/node";
import type {
  AllowDragFunction,
  AllowDropFunction,
  CheckedInfo,
  FilterNodeMethodFunction,
  LoadFunction,
  NodeDropType,
  RenderContentFunction,
  TreeData,
  TreeDragPayload,
  TreeKey,
  TreeNodeData,
  TreeOptionProps
} from "./tree.type";

export interface TreeProps {
  data?: TreeData;
  emptyText?: string;
  renderAfterExpand?: boolean;
  nodeKey?: string;
  checkStrictly?: boolean;
  checkDescendants?: boolean;
  defaultExpandAll?: boolean;
  expandOnClickNode?: boolean;
  checkOnClickNode?: boolean;
  checkOnClickLeaf?: boolean;
  autoExpandParent?: boolean;
  defaultCheckedKeys?: TreeKey[];
  defaultExpandedKeys?: TreeKey[];
  currentNodeKey?: TreeKey | null;
  renderContent?: RenderContentFunction;
  showCheckbox?: boolean;
  props?: TreeOptionProps;
  lazy?: boolean;
  draggable?: boolean;
  allowDrag?: AllowDragFunction;
  allowDrop?: AllowDropFunction;
  highlightCurrent?: boolean;
  load?: LoadFunction;
  filterNodeMethod?: FilterNodeMethodFunction;
  accordion?: boolean;
  indent?: number;
  icon?: string | Component;
}

export const DEFAULT_TREE_EMPTY_TEXT = "暂无数据";
export const DEFAULT_TREE_EXPAND_ICON = "mdi:chevron-right";
export const DEFAULT_TREE_LOADING_ICON = "mdi:loading";

export const treeProps = {
  data: {
    type: Array as PropType<TreeData>,
    default: () => []
  },
  emptyText: {
    type: String,
    default: DEFAULT_TREE_EMPTY_TEXT
  },
  renderAfterExpand: {
    type: Boolean,
    default: true
  },
  nodeKey: {
    type: String,
    default: undefined
  },
  checkStrictly: {
    type: Boolean,
    default: false
  },
  checkDescendants: {
    type: Boolean,
    default: false
  },
  defaultExpandAll: {
    type: Boolean,
    default: false
  },
  expandOnClickNode: {
    type: Boolean,
    default: true
  },
  checkOnClickNode: {
    type: Boolean,
    default: false
  },
  checkOnClickLeaf: {
    type: Boolean,
    default: true
  },
  autoExpandParent: {
    type: Boolean,
    default: true
  },
  defaultCheckedKeys: {
    type: Array as PropType<TreeKey[]>,
    default: undefined
  },
  defaultExpandedKeys: {
    type: Array as PropType<TreeKey[]>,
    default: undefined
  },
  currentNodeKey: {
    type: [String, Number] as PropType<TreeKey | null>,
    default: undefined
  },
  renderContent: {
    type: Function as PropType<RenderContentFunction>,
    default: undefined
  },
  showCheckbox: {
    type: Boolean,
    default: false
  },
  props: {
    type: Object as PropType<TreeOptionProps>,
    default: (): TreeOptionProps => ({
      children: "children",
      label: "label",
      disabled: "disabled"
    })
  },
  lazy: {
    type: Boolean,
    default: false
  },
  draggable: {
    type: Boolean,
    default: false
  },
  allowDrag: {
    type: Function as PropType<AllowDragFunction>,
    default: undefined
  },
  allowDrop: {
    type: Function as PropType<AllowDropFunction>,
    default: undefined
  },
  highlightCurrent: {
    type: Boolean,
    default: false
  },
  load: {
    type: Function as PropType<LoadFunction>,
    default: undefined
  },
  filterNodeMethod: {
    type: Function as PropType<FilterNodeMethodFunction>,
    default: undefined
  },
  accordion: {
    type: Boolean,
    default: false
  },
  indent: {
    type: Number,
    default: 18
  },
  icon: {
    type: [String, Object, Function] as PropType<string | Component>,
    default: DEFAULT_TREE_EXPAND_ICON
  }
} as const;

export const treeEmits = {
  "check-change": (_data: TreeNodeData, _checked: boolean, _indeterminate: boolean) => true,
  "current-change": (_data: TreeNodeData | null, _node: Node | null) => true,
  "node-click": (
    _data: TreeNodeData,
    _node: Node,
    _nodeInstance: ComponentInternalInstance | null,
    _event: MouseEvent
  ) => true,
  "node-contextmenu": (
    _event: Event,
    _data: TreeNodeData,
    _node: Node,
    _nodeInstance: ComponentInternalInstance | null
  ) => true,
  "node-collapse": (
    _data: TreeNodeData,
    _node: Node,
    _nodeInstance: ComponentInternalInstance | null
  ) => true,
  "node-expand": (
    _data: TreeNodeData,
    _node: Node,
    _nodeInstance: ComponentInternalInstance | null
  ) => true,
  "node-drag-start": (_node: Node, _event: DragEvent) => true,
  "node-drag-enter": (_draggingNode: Node, _dropNode: Node, _event: DragEvent) => true,
  "node-drag-leave": (_draggingNode: Node, _dropNode: Node, _event: DragEvent) => true,
  "node-drag-over": (_draggingNode: Node, _dropNode: Node, _event: DragEvent) => true,
  "node-drag-end": (
    _draggingNode: Node,
    _dropNode: Node | null,
    _dropType: NodeDropType,
    _event: DragEvent,
    _detail: TreeDragPayload
  ) => true,
  "node-drop": (
    _draggingNode: Node,
    _dropNode: Node,
    _dropType: Exclude<NodeDropType, "none">,
    _event: DragEvent,
    _detail: TreeDragPayload
  ) => true,
  check: (_data: TreeNodeData, _checkedInfo: CheckedInfo) => true
} as const;
