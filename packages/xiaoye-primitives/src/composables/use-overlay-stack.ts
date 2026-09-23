import { computed, onBeforeUnmount, ref, shallowRef } from "vue";
import type { ComputedRef, Ref } from "vue";

interface OverlayEntry {
  id: symbol;
  zIndex: Ref<number>;
  isTopMost: () => boolean;
  openLayer: () => void;
  closeLayer: () => void;
}

function createStack() {
  // 栈容器必须用 shallowRef：深层 ref 会把每个 entry 代理化并自动解包其 zIndex，
  // 导致 getTopEntry 比较时读到 undefined。栈更新本就通过 notifyStackChange
  // 整体重赋值来触发响应，深层响应式从未被依赖。
  const stack = shallowRef<Set<OverlayEntry>>(new Set());
  const zIndexCounter = ref(2000);

  function notifyStackChange() {
    stack.value = new Set(stack.value);
  }

  function getTopEntry(): OverlayEntry | undefined {
    let top: OverlayEntry | undefined;
    let maxZ = -Infinity;

    for (const entry of stack.value) {
      if (entry.zIndex.value > maxZ) {
        maxZ = entry.zIndex.value;
        top = entry;
      }
    }

    return top;
  }

  function createOverlayEntry(): OverlayEntry {
    const id = Symbol("overlay");
    let opened = false;
    const disposed = false;

    const entry: OverlayEntry = {
      id,
      zIndex: ref(-1),
      isTopMost: () => {
        if (disposed || !opened) return false;
        const top = getTopEntry();
        return top?.id === id;
      },
      openLayer: () => {
        if (disposed) return;
        entry.zIndex.value = ++zIndexCounter.value;
        if (!opened) {
          stack.value.add(entry);
          opened = true;
        }
        notifyStackChange();
      },
      closeLayer: () => {
        if (disposed || !opened) return;
        opened = false;
        entry.zIndex.value = -1;
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
    // entry.zIndex 是 ref，computed 必须显式读取 .value 建立依赖，
    // 否则依赖集为空、首次读取后永久缓存（重开浮层拿到旧 z 值、预读恒 -1）。
    zIndex: computed(() => entry.zIndex.value),
    isTopMost: entry.isTopMost,
    openLayer: entry.openLayer,
    closeLayer: entry.closeLayer
  };
}
