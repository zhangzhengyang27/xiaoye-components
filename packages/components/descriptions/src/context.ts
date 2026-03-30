import type { ComputedRef, InjectionKey } from "vue";
import type { ComponentSize } from "@xiaoye/utils";

export interface DescriptionsContext {
  border: ComputedRef<boolean>;
  direction: ComputedRef<"horizontal" | "vertical">;
  labelWidth: ComputedRef<string | number | undefined>;
  size: ComputedRef<ComponentSize>;
}

export const descriptionsKey: InjectionKey<DescriptionsContext> = Symbol("xiaoye-descriptions");
