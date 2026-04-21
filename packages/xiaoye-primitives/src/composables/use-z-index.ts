import { computed, ref } from "vue";

const seed = ref(0);

export function useZIndex() {
  const zIndex = computed(() => 2000);

  const next = () => {
    seed.value += 1;
    return zIndex.value + seed.value;
  };

  return {
    current: computed(() => zIndex.value + seed.value),
    next
  };
}
