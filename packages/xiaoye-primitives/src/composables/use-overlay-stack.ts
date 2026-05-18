import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from "vue";
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
    let closed = false;

    const entry: OverlayEntry = {
      id,
      zIndex: -1,
      isTopMost: () => {
        if (closed) return false;
        const top = getTopEntry();
        return top?.id === id;
      },
      openLayer: () => {
        if (closed) return;
        entry.zIndex = ++zIndexCounter.value;
        stack.value.add(entry);
        notifyStackChange();
      },
      closeLayer: () => {
        if (closed) return;
        closed = true;
        stack.value.delete(entry);
        notifyStackChange();
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
  const instance = getCurrentInstance();

  const stackFactory =
    typeof document !== "undefined" && instance
      ? (() => {
          const stacks = new WeakMap<object, ReturnType<typeof createStack>>();
          return () => {
            let s = stacks.get(instance!);
            if (!s) {
              s = createStack();
              stacks.set(instance!, s);
            }
            return s;
          };
        })()
      : null;

  const { createOverlayEntry } = stackFactory?.() ?? globalStack;

  const entry = createOverlayEntry();

  onMounted(() => {
    entry.openLayer();
  });

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
