import type { ComputedRef, InjectionKey } from "vue";

export interface BreadcrumbContext {
  separator: ComputedRef<string>;
  separatorIcon: ComputedRef<string>;
  registerItem: (uid: number) => void;
  unregisterItem: (uid: number) => void;
  isLast: (uid: number) => boolean;
}

export const breadcrumbContextKey: InjectionKey<BreadcrumbContext> = Symbol("xy-breadcrumb");
