<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, toRef, watch } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { splitterContextKey } from "./context";
import type { SplitterPanelRegistration } from "./context";
import type {
  SplitterCollapseDirection,
  SplitterProps,
  SplitterSize
} from "./splitter";

interface PanelBounds {
  min: number;
  max: number;
}

const props = withDefaults(defineProps<SplitterProps>(), {
  layout: "horizontal",
  lazy: false
});

const emit = defineEmits<{
  resizeStart: [index: number, sizes: number[]];
  resize: [index: number, sizes: number[]];
  resizeEnd: [index: number, sizes: number[]];
  collapse: [index: number, direction: SplitterCollapseDirection, sizes: number[]];
}>();

const ns = useNamespace("splitter");
const containerRef = ref<HTMLDivElement | null>(null);
const containerSize = ref(0);
const panels = ref<SplitterPanelRegistration[]>([]);
const sizes = ref<number[]>([]);
const movingIndex = ref<number | null>(null);
const previewOffset = ref(0);
const lastContainerSize = ref(0);
const collapseMemory = new Map<number, number>();

const panelSignature = computed(() =>
  panels.value
    .map((panel) =>
      [panel.size ?? "", panel.min ?? "", panel.max ?? "", panel.resizable, panel.collapsible].join(
        ":"
      )
    )
    .join("|")
);

const rootClasses = computed(() => [ns.base.value, `${ns.base.value}--${props.layout}`]);
const rootStyles = computed(() => ({
  [ns.cssVarBlock("offset")]: `${previewOffset.value}px`
}));
const maskClasses = computed(() => [
  `${ns.base.value}__mask`,
  `${ns.base.value}__mask--${props.layout}`
]);

let resizeObserver: ResizeObserver | null = null;
let dragState: { index: number; startSizes: number[]; pendingOffset: number } | null = null;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function roundSize(value: number) {
  return Math.round(value * 1000) / 1000;
}

function resolveSize(value: SplitterSize | undefined, total: number) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.max(value, 0) : undefined;
  }

  const normalized = value.trim();

  if (!normalized) {
    return undefined;
  }

  if (normalized.endsWith("%")) {
    const percent = Number.parseFloat(normalized.slice(0, -1));
    return Number.isFinite(percent) ? Math.max((percent / 100) * total, 0) : undefined;
  }

  if (normalized.endsWith("px")) {
    const pixels = Number.parseFloat(normalized.slice(0, -2));
    return Number.isFinite(pixels) ? Math.max(pixels, 0) : undefined;
  }

  const fallback = Number.parseFloat(normalized);
  return Number.isFinite(fallback) ? Math.max(fallback, 0) : undefined;
}

function getPanelBounds(total: number): PanelBounds[] {
  return panels.value.map((panel) => {
    const min = resolveSize(panel.min, total) ?? 0;
    const resolvedMax = resolveSize(panel.max, total);
    const max =
      resolvedMax === undefined ? Number.POSITIVE_INFINITY : Math.max(resolvedMax, min);

    return { min, max };
  });
}

function fitSizes(initialSizes: number[], total: number, bounds: PanelBounds[]) {
  const nextSizes = initialSizes.map((size, index) =>
    clamp(Number.isFinite(size) ? size : 0, bounds[index]?.min ?? 0, bounds[index]?.max ?? Infinity)
  );

  let guard = 0;

  while (guard < 60) {
    guard += 1;
    const sum = nextSizes.reduce((acc, size) => acc + size, 0);
    const diff = total - sum;

    if (Math.abs(diff) < 0.5) {
      break;
    }

    const grow = diff > 0;
    const candidates = nextSizes
      .map((size, index) => ({ index, size, bounds: bounds[index] }))
      .filter(({ size, bounds }) =>
        grow ? size < bounds.max - 0.5 : size > bounds.min + 0.5
      );

    if (!candidates.length) {
      break;
    }

    const share = diff / candidates.length;
    let consumed = 0;

    candidates.forEach(({ index, bounds }) => {
      if (grow) {
        const delta = Math.min(bounds.max - nextSizes[index], share);
        nextSizes[index] += delta;
        consumed += delta;
      } else {
        const delta = Math.min(nextSizes[index] - bounds.min, Math.abs(share));
        nextSizes[index] -= delta;
        consumed += delta;
      }
    });

    if (consumed < 0.5) {
      break;
    }
  }

  const finalDiff = total - nextSizes.reduce((acc, size) => acc + size, 0);
  if (Math.abs(finalDiff) >= 0.5) {
    const candidates = nextSizes
      .map((size, index) => ({ index, size, bounds: bounds[index] }))
      .filter(({ size, bounds }) =>
        finalDiff > 0 ? size < bounds.max - 0.5 : size > bounds.min + 0.5
      );

    if (candidates.length) {
      const target = candidates[candidates.length - 1];
      nextSizes[target.index] = clamp(
        nextSizes[target.index] + finalDiff,
        target.bounds.min,
        target.bounds.max
      );
    }
  }

  return nextSizes.map(roundSize);
}

function buildInitialSizes(total: number) {
  if (!panels.value.length || total <= 0) {
    return panels.value.map(() => 0);
  }

  const bounds = getPanelBounds(total);
  const currentSizesAvailable =
    sizes.value.length === panels.value.length && lastContainerSize.value > 0;
  let initialSizes: number[];

  if (currentSizesAvailable) {
    const scale = total / lastContainerSize.value;
    initialSizes = sizes.value.map((size) => size * scale);
  } else {
    const explicitSizes: Array<number | undefined> = panels.value.map((panel) =>
      resolveSize(panel.size, total)
    );
    const explicitTotal = explicitSizes.reduce<number>((acc, value) => acc + (value ?? 0), 0);
    const autoCount = explicitSizes.filter((value) => value === undefined).length;
    const fallbackSize = autoCount > 0 ? Math.max(total - explicitTotal, 0) / autoCount : 0;

    initialSizes = explicitSizes.map((value) => value ?? fallbackSize);

    if (!autoCount && initialSizes.length) {
      const lastIndex = initialSizes.length - 1;
      initialSizes[lastIndex] = (initialSizes[lastIndex] ?? 0) + (total - explicitTotal);
    }
  }

  panels.value.forEach((panel, index) => {
    const preferred = resolveSize(panel.size, total);
    if (preferred !== undefined) {
      initialSizes[index] = preferred;
    }
  });

  return fitSizes(initialSizes, total, bounds);
}

function getBarPair(index: number) {
  const current = panels.value[index];
  const next = panels.value[index + 1];

  if (!current || !next) {
    return null;
  }

  return { current, next };
}

function canResize(index: number) {
  const pair = getBarPair(index);
  return Boolean(pair?.current.resizable && pair?.next.resizable);
}

function applyOffset(startSizes: number[], index: number, offset: number) {
  const pair = getBarPair(index);
  if (!pair) {
    return [...startSizes];
  }

  const total = containerSize.value;
  const bounds = getPanelBounds(total);
  const nextSizes = [...startSizes];
  const firstIndex = index;
  const secondIndex = index + 1;
  const pairTotal = startSizes[firstIndex] + startSizes[secondIndex];
  const firstBounds = bounds[firstIndex];
  const secondBounds = bounds[secondIndex];

  const minFirst = Math.max(firstBounds.min, pairTotal - secondBounds.max);
  const maxFirst = Math.min(firstBounds.max, pairTotal - secondBounds.min);
  const nextFirst = clamp(startSizes[firstIndex] + offset, minFirst, maxFirst);

  nextSizes[firstIndex] = roundSize(nextFirst);
  nextSizes[secondIndex] = roundSize(pairTotal - nextFirst);

  return nextSizes;
}

function notifySizeUpdates(nextSizes: number[], indices: number[]) {
  const total = containerSize.value;

  indices.forEach((index) => {
    const panel = panels.value[index];
    if (!panel || panel.size === undefined) {
      return;
    }

    const currentValue = resolveSize(panel.size, total);
    const nextValue = nextSizes[index];

    if (currentValue === undefined || Math.abs(currentValue - nextValue) > 0.5) {
      panel.emitSizeUpdate(nextValue);
    }
  });
}

function syncPanelIndexes() {
  panels.value.forEach((panel, index) => {
    panel.setIndex(index);
  });
}

function measureContainer() {
  const element = containerRef.value;

  if (!element) {
    containerSize.value = 0;
    return;
  }

  const rect = element.getBoundingClientRect();
  const measured =
    props.layout === "horizontal"
      ? rect.width || element.clientWidth
      : rect.height || element.clientHeight;

  containerSize.value = Math.max(measured, 0);
}

function reconnectResizeObserver() {
  resizeObserver?.disconnect();

  if (typeof ResizeObserver === "undefined" || !containerRef.value) {
    resizeObserver = null;
    return;
  }

  resizeObserver = new ResizeObserver(() => {
    measureContainer();
  });
  resizeObserver.observe(containerRef.value);
}

function recalculateSizes() {
  sizes.value = buildInitialSizes(containerSize.value);
  lastContainerSize.value = containerSize.value;
}

function registerPanel(panel: SplitterPanelRegistration) {
  if (panels.value.some((item) => item.uid === panel.uid)) {
    return;
  }

  panels.value = [...panels.value, panel];
  syncPanelIndexes();
}

function unregisterPanel(uid: number) {
  const nextPanels = panels.value.filter((panel) => panel.uid !== uid);

  if (nextPanels.length === panels.value.length) {
    return;
  }

  panels.value = nextPanels;
  sizes.value = [];
  syncPanelIndexes();

  if (movingIndex.value !== null && movingIndex.value >= nextPanels.length) {
    movingIndex.value = null;
    previewOffset.value = 0;
    dragState = null;
  }
}

function getPanel(index: number) {
  return panels.value[index];
}

function getPanelSize(index: number) {
  return sizes.value[index] ?? 0;
}

function onResizeStart(index: number) {
  if (!canResize(index)) {
    return;
  }

  movingIndex.value = index;
  previewOffset.value = 0;
  dragState = {
    index,
    startSizes: [...sizes.value],
    pendingOffset: 0
  };

  emit("resizeStart", index, [...sizes.value]);
}

function onResize(index: number, offset: number) {
  if (!dragState || dragState.index !== index) {
    return;
  }

  const nextSizes = applyOffset(dragState.startSizes, index, offset);
  const resolvedOffset = nextSizes[index] - dragState.startSizes[index];

  dragState.pendingOffset = resolvedOffset;
  previewOffset.value = resolvedOffset;

  if (props.lazy) {
    return;
  }

  sizes.value = nextSizes;
  notifySizeUpdates(nextSizes, [index, index + 1]);
  emit("resize", index, [...nextSizes]);
}

function onResizeEnd(index: number) {
  if (!dragState || dragState.index !== index) {
    return;
  }

  const state = dragState;
  const finalSizes = props.lazy
    ? applyOffset(state.startSizes, index, state.pendingOffset)
    : [...sizes.value];

  if (props.lazy) {
    sizes.value = finalSizes;
    notifySizeUpdates(finalSizes, [index, index + 1]);
  }

  dragState = null;
  movingIndex.value = null;
  previewOffset.value = 0;

  nextTick(() => {
    emit("resizeEnd", index, [...finalSizes]);
  });
}

function toggleCollapsed(index: number, direction: SplitterCollapseDirection) {
  const targetIndex = direction === "start" ? index : index + 1;
  const siblingIndex = direction === "start" ? index + 1 : index;
  const total = containerSize.value;
  const bounds = getPanelBounds(total);
  const nextSizes = [...sizes.value];
  const pairTotal = nextSizes[targetIndex] + nextSizes[siblingIndex];
  const targetSize = nextSizes[targetIndex];

  if (targetSize > 0.5) {
    collapseMemory.set(targetIndex, targetSize);
    nextSizes[targetIndex] = 0;
    nextSizes[siblingIndex] = roundSize(pairTotal);
    return nextSizes;
  }

  const remembered = collapseMemory.get(targetIndex);
  const preferred = resolveSize(panels.value[targetIndex]?.size, total);
  const desired = remembered ?? preferred ?? Math.max(pairTotal / 2, bounds[targetIndex].min);

  const minTarget = Math.max(bounds[targetIndex].min, pairTotal - bounds[siblingIndex].max);
  const maxTarget = Math.min(bounds[targetIndex].max, pairTotal - bounds[siblingIndex].min);
  const restored = clamp(desired, minTarget, maxTarget);

  nextSizes[targetIndex] = roundSize(restored);
  nextSizes[siblingIndex] = roundSize(pairTotal - restored);
  return nextSizes;
}

function onCollapse(index: number, direction: SplitterCollapseDirection) {
  const pair = getBarPair(index);
  if (!pair) {
    return;
  }

  const targetPanel = direction === "start" ? pair.current : pair.next;
  if (!targetPanel.collapsible) {
    return;
  }

  const nextSizes = toggleCollapsed(index, direction);
  sizes.value = nextSizes;
  notifySizeUpdates(nextSizes, [index, index + 1]);
  emit("collapse", index, direction, [...nextSizes]);
}

watch([containerSize, panelSignature], () => {
  recalculateSizes();
}, {
  immediate: true
});

watch(
  () => props.layout,
  () => {
    nextTick(() => {
      measureContainer();
      recalculateSizes();
    });
  }
);

onMounted(() => {
  measureContainer();
  reconnectResizeObserver();
  window.addEventListener("resize", measureContainer);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("resize", measureContainer);
});

provide(splitterContextKey, {
  layout: toRef(props, "layout"),
  lazy: toRef(props, "lazy"),
  panels,
  movingIndex,
  previewOffset,
  registerPanel,
  unregisterPanel,
  getPanel,
  getPanelSize,
  onResizeStart,
  onResize,
  onResizeEnd,
  onCollapse
});
</script>

<template>
  <div ref="containerRef" :class="rootClasses" :style="rootStyles">
    <slot />
    <div v-if="movingIndex !== null" :class="maskClasses" />
  </div>
</template>
