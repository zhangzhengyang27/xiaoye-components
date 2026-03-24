import type { ComputedRef, InjectionKey, Ref } from "vue";

export type CollapseActiveName = string | number;
export type CollapseModelValue = CollapseActiveName | CollapseActiveName[];
export type CollapseExpandIconPosition = "left" | "right";
export type CollapseBeforeCollapse = (
  name: CollapseActiveName
) => boolean | Promise<boolean>;

export interface CollapseContext {
  activeNames: Ref<CollapseActiveName[]>;
  accordion: ComputedRef<boolean>;
  expandIconPosition: ComputedRef<CollapseExpandIconPosition>;
  toggleItem: (name: CollapseActiveName) => Promise<void>;
}

export const collapseContextKey: InjectionKey<CollapseContext> = Symbol("xiaoye-collapse");
