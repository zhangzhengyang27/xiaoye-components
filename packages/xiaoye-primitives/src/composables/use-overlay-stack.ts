import { computed, onBeforeUnmount, ref } from "vue";
import type { ComputedRef } from "vue";

interface OverlayEntry {
  id: symbol;
  zIndex: number;
  isTopMost: () => boolean;
  openLayer: () => void;
  closeLayer: () => void;
}

function createStack() {
  const stack = ref<Set<OverlayEntry>>(new Set());
  const zIndexCounter = ref(2000);

  function notifyStackChange() {
    stack.value = new Set(stack.value);
  }

  function getTopEntry(): OverlayEntry | undefined {
    let top: OverlayEntry | undefined;
    let maxZ = -Infinity;

    for (const entry of stack.value) {
      if (entry.zIndex > maxZ) {
        maxZ = entry.zIndex;
        top = entry;
      }
    }

    return top;
  }

  function createOverlayEntry(): OverlayEntry {
    const id = Symbol("overlay");
    let opened = false;
    let disposed = false;

    const entry: OverlayEntry = {
      id,
      zIndex: -1,
      isTopMost: () => {
        if (disposed || !opened) return false;
        const top = getTopEntry();
        return top?.id === id;
      },
      openLayer: () => {
        if (disposed) return;
        entry.zIndex = ++zIndexCounter.value;
        if (!opened) {
          stack.value.add(entry);
          opened = true;
        }
        notifyStackChange();
      },
      closeLayer: () => {
        if (disposed || !opened) return;
        opened = false;
        entry.zIndex = -1;
        if (stack.value.delete(entry)) {
          notifyStackChange();
        }
      }
    };

    return entry;
  }

  return { createOverlayEntry };
}

const globalStack = createStack();

export interface OverlayStackEntry {
  zIndex: ComputedRef<number>;
  isTopMost: () => boolean;
  openLayer: () => void;
  closeLayer: () => void;
}

export function useOverlayStack(): OverlayStackEntry {
  const entry = globalStack.createOverlayEntry();

  onBeforeUnmount(() => {
    entry.closeLayer();
  });

  return {
    zIndex: computed(() => entry.zIndex),
    isTopMost: entry.isTopMost,
    openLayer: entry.openLayer,
    closeLayer: entry.closeLayer
  };
}
