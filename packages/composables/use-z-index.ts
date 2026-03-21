import { computed, ref } from "vue";
import { useConfig } from "./use-config";

const seed = ref(0);

export function useZIndex() {
  const { zIndex } = useConfig();

  const next = () => {
    seed.value += 1;
    return zIndex.value + seed.value;
  };

  return {
    current: computed(() => zIndex.value + seed.value),
    next
  };
}
