import type { ComputedRef, InjectionKey, MaybeRef } from "vue";
import type { ComponentSize } from "@xiaoye/utils";

export interface ConfigProviderContext {
  namespace: ComputedRef<string>;
  locale: ComputedRef<Record<string, string>>;
  zIndex: ComputedRef<number>;
  size: ComputedRef<ComponentSize>;
}

export interface ConfigProviderProps {
  namespace?: string;
  locale?: Record<string, string>;
  zIndex?: number;
  size?: ComponentSize;
}

export const configProviderKey: InjectionKey<ConfigProviderContext> =
  Symbol("xiaoye-config-provider");

export const DEFAULT_NAMESPACE = "xy";

export function resolveMaybeRef<T>(value: MaybeRef<T>) {
  return value;
}

