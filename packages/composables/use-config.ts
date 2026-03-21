import { computed, inject } from "vue";
import {
  DEFAULT_NAMESPACE,
  configProviderKey
} from "../components/config-provider/src/context";

export function useConfig() {
  const config = inject(configProviderKey, null);

  return {
    namespace: computed(() => config?.namespace.value ?? DEFAULT_NAMESPACE),
    size: computed(() => config?.size.value ?? "md"),
    zIndex: computed(() => config?.zIndex.value ?? 2000),
    locale: computed(() => config?.locale.value ?? {})
  };
}
