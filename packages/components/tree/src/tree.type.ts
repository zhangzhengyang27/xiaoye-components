import type {
  Component,
  ComponentInternalInstance,
  Ref,
  Slots,
  VNode,
  h
} from "vue";
import type Node from "./model/node";
import type TreeStore from "./model/tree-store";
import type { TreeProps } from "./tree";

export type TreeData = TreeNodeData[];
export type TreeKey = string | number;
export type FilterValue = string | number | boolean | null | undefined;
export type TreeNodeData = Record<string, any>;
export type TreeNodeClassName = string | Record<string, boolean>;

export interface FakeNode {
  data: TreeNodeData;
}

export interface TreeNodeLoadedDefaultProps {
  checked?: boolean;
}

export interface TreeNodeChildState {
  all: boolean;
  none: boolean;
  half: boolean;
  isEffectivelyChecked: boolean;
}

export interface TreeNodeOptions {
  data: TreeData | TreeNodeData;
  store: TreeStore;
  parent?: Node;
}

export interface TreeStoreNodesMap {
  [key: string]: Node;
}

export interface TreeOptionProps {
  children?: string;
  label?: string | ((data: TreeNodeData, node: Node) => string);
  disabled?: string | ((data: TreeNodeData, node: Node) => boolean);
  isLeaf?: string | ((data: TreeNodeData, node: Node) => boolean);
  class?: TreeNodeClassName | ((data: TreeNodeData, node: Node) => TreeNodeClassName);
}

export interface RenderContentContext {
  _self: ComponentInternalInstance | null;
  node: Node;
  data: TreeNodeData;
  store: TreeStore;
}

export type HType = typeof h;
export type RenderContentFunction = (h: HType, context: RenderContentContext) => VNode | VNode[];
export type LoadFunction = (
  rootNode: Node,
  resolve: (data: TreeData) => void,
  reject: () => void
) => void;
export type FilterNodeMethodFunction = (
  value: FilterValue,
  data: TreeNodeData,
  node: Node
) => boolean;

export interface TreeStoreOptions {
  key?: string;
  data: TreeData;
  lazy: boolean;
  props: TreeOptionProps;
  load?: LoadFunction;
  currentNodeKey?: TreeKey | null;
  checkStrictly: boolean;
  defaultCheckedKeys?: TreeKey[];
  defaultExpandedKeys?: TreeKey[];
  autoExpandParent: boolean;
  defaultExpandAll: boolean;
  filterNodeMethod?: FilterNodeMethodFunction;
  accordion: boolean;
}

export interface CheckedInfo {
  checkedKeys: TreeKey[];
  checkedNodes: TreeData;
  halfCheckedKeys: TreeKey[];
  halfCheckedNodes: TreeData;
}

export interface TreeExposes {
  filter: (value: FilterValue) => void;
  updateKeyChildren: (key: TreeKey, data: TreeNodeData[]) => void;
  getCheckedNodes: (leafOnly?: boolean, includeHalfChecked?: boolean) => TreeNodeData[];
  setCheckedNodes: (nodes: TreeNodeData[], leafOnly?: boolean) => void;
  getCheckedKeys: (leafOnly?: boolean) => TreeKey[];
  setCheckedKeys: (keys: TreeKey[], leafOnly?: boolean) => void;
  setChecked: (data: TreeKey | TreeNodeData, checked: boolean, deep: boolean) => void;
  getHalfCheckedNodes: () => TreeNodeData[];
  getHalfCheckedKeys: () => TreeKey[];
  getCurrentKey: () => TreeKey | null;
  getCurrentNode: () => TreeNodeData | null;
  setCurrentKey: (key?: TreeKey | null, shouldAutoExpandParent?: boolean) => void;
  setCurrentNode: (node: TreeKey | TreeNodeData | Node, shouldAutoExpandParent?: boolean) => void;
  getNode: (data: TreeKey | TreeNodeData) => Node | null;
  remove: (data: TreeNodeData | Node) => void;
  append: (data: TreeNodeData, parentNode?: TreeNodeData | TreeKey | Node) => void;
  insertBefore: (data: TreeNodeData, refNode: TreeKey | TreeNodeData | Node) => void;
  insertAfter: (data: TreeNodeData, refNode: TreeKey | TreeNodeData | Node) => void;
}

export interface RootTreeType {
  emit: any;
  slots: Slots;
  props: TreeProps;
  store: Ref<TreeStore>;
  root: Ref<Node>;
  instance: ComponentInternalInstance | null;
  focusTreeItem: (node: Node | null | undefined) => void;
}

export type TreeNodeClassValue = TreeNodeClassName | undefined;
export type TreeNodeIcon = string | Component;
