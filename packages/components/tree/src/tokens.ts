import type { ComponentInternalInstance, InjectionKey } from "vue";
import type { RootTreeType } from "./tree.type";

export const ROOT_TREE_INJECTION_KEY: InjectionKey<RootTreeType> = Symbol("xiaoye-tree-root");

export const NODE_INSTANCE_INJECTION_KEY: InjectionKey<ComponentInternalInstance | null> = Symbol(
  "xiaoye-tree-node-instance"
);
