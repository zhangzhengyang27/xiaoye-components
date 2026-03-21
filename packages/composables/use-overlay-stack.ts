import { computed, onBeforeUnmount, ref } from "vue";
import { useZIndex } from "./use-z-index";

const overlayStack = ref<string[]>([]);

function removeLayer(id: string) {
  overlayStack.value = overlayStack.value.filter((item) => item !== id);
}

export function useOverlayStack() {
  const overlayId = `xy-overlay-${Math.random().toString(36).slice(2, 10)}`;
  const { next } = useZIndex();
  const zIndex = ref(next());

  function openLayer() {
    removeLayer(overlayId);
    overlayStack.value.push(overlayId);
    zIndex.value = next();
  }

  function closeLayer() {
    removeLayer(overlayId);
  }

  const isTopMost = computed(() => overlayStack.value[overlayStack.value.length - 1] === overlayId);

  onBeforeUnmount(() => {
    closeLayer();
  });

  return {
    overlayId,
    zIndex,
    isTopMost,
    openLayer,
    closeLayer
  };
}

