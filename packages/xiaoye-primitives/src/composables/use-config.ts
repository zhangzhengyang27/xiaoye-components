import { computed } from "vue";
import type { ComputedRef } from "vue";
import { DEFAULT_NAMESPACE, type ComponentSize, type Locale } from "./shared-context";

export interface ConfigContext {
  namespace: ComputedRef<string>;
  size: ComputedRef<ComponentSize>;
  zIndex: ComputedRef<number>;
  locale: ComputedRef<Locale>;
  dialog: ComputedRef<Record<string, unknown>>;
  loading: ComputedRef<Record<string, unknown>>;
  message: ComputedRef<Record<string, unknown>>;
  notification: ComputedRef<Record<string, unknown>>;
}

export function useConfig(): ConfigContext {
  return {
    namespace: computed(() => DEFAULT_NAMESPACE),
    size: computed(() => "md" as ComponentSize),
    zIndex: computed(() => 2000),
    locale: computed(() => ({} as Locale)),
    dialog: computed(() => ({})),
    loading: computed(() => ({})),
    message: computed(() => ({})),
    notification: computed(() => ({}))
  };
}
