import type { InjectionKey } from "vue";

// Define config symbols in primitives so all layers share the same injection key.
// Components layer imports from here; ConfigProvider.vue provides using these exports.
// This avoids circular deps because primitives has no dependency on components.
export const configProviderKey: InjectionKey<SharedConfigContext> =
  Symbol("xiaoye-config-provider");

export type ComponentSize = "" | "xs" | "sm" | "md" | "lg" | "xl";

export interface SharedConfigContext {
  namespace: string;
  locale: Record<string, string>;
  zIndex: number;
  size: ComponentSize;
  dialog?: unknown;
  loading?: unknown;
  message?: unknown;
  notification?: unknown;
}

export const DEFAULT_NAMESPACE = "xy";
export const DEFAULT_Z_INDEX = 2000;
export const DEFAULT_SIZE: ComponentSize = "md";
