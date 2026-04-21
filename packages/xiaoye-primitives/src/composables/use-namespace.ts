import { computed } from "vue";
import { configProviderKey, DEFAULT_NAMESPACE } from "./shared-context";

export function useNamespace(block: string) {
  const namespace = computed(() => DEFAULT_NAMESPACE);
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
