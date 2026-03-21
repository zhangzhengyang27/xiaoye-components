import { computed, inject } from "vue";
import { configProviderKey, DEFAULT_NAMESPACE } from "../components/config-provider/src/context";

export function useNamespace(block: string) {
  const config = inject(configProviderKey, null);

  const namespace = computed(() => config?.namespace.value ?? DEFAULT_NAMESPACE);
  const base = computed(() => `${namespace.value}-${block}`);

  const is = (state: string, active?: boolean) => (active ? `is-${state}` : "");
  const cssVarBlock = (name: string) => `--${namespace.value}-${block}-${name}`;

  return {
    namespace,
    base,
    is,
    cssVarBlock
  };
}
