<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, watch } from "vue";
import type { CSSProperties, StyleValue } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { ScrollbarDirection, ScrollbarProps } from "./scrollbar";

const BAR_GAP = 4;

const props = withDefaults(defineProps<ScrollbarProps>(), {
  distance: 0,
  height: "",
  maxHeight: "",
  native: false,
  wrapStyle: "",
  wrapClass: "",
  viewClass: "",
  viewStyle: "",
  noresize: false,
  tag: "div",
  always: false,
  minSize: 20,
  tabindex: undefined,
  id: undefined,
  role: undefined,
  ariaLabel: undefined,
  ariaOrientation: undefined
});

const emit = defineEmits<{
  scroll: [payload: { scrollTop: number; scrollLeft: number }];
  endReached: [direction: ScrollbarDirection];
}>();

const ns = useNamespace("scrollbar");

const scrollbarRef = ref<HTMLDivElement | null>(null);
const wrapRef = ref<HTMLDivElement | null>(null);
const viewRef = ref<HTMLElement | null>(null);

const hover = ref(false);
const draggingAxis = ref<"vertical" | "horizontal" | null>(null);

const verticalVisible = ref(false);
const horizontalVisible = ref(false);
const verticalThumbSize = ref(0);
const horizontalThumbSize = ref(0);
const verticalThumbMove = ref(0);
const horizontalThumbMove = ref(0);

const lastScrollTop = ref(0);
const lastScrollLeft = ref(0);
const reachedState = ref<Record<ScrollbarDirection, boolean>>({
  top: false,
  bottom: false,
  left: false,
  right: false
});

const dragState = ref({
  axis: null as "vertical" | "horizontal" | null,
  startClient: 0,
  startScroll: 0
});

let resizeObserver: ResizeObserver | null = null;
let resizeListener: (() => void) | null = null;
let originalUserSelect = "";

function addUnit(value: string | number | undefined) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return typeof value === "number" ? `${value}px` : value;
}

const wrapStyles = computed<StyleValue>(() => {
  const style: CSSProperties = {};
  const height = addUnit(props.height);
  const maxHeight = addUnit(props.maxHeight);

  if (height) {
    style.height = height;
  }

  if (maxHeight) {
    style.maxHeight = maxHeight;
  }

  return [props.wrapStyle, style];
});

const wrapKls = computed(() => [
  `${ns.base.value}__wrap`,
  !props.native && `${ns.base.value}__wrap--hidden-default`,
  props.wrapClass
]);

const viewKls = computed(() => [`${ns.base.value}__view`, props.viewClass]);

const showVerticalBar = computed(
  () => verticalVisible.value && (props.always || hover.value || draggingAxis.value === "vertical")
);
const showHorizontalBar = computed(
  () =>
    horizontalVisible.value && (props.always || hover.value || draggingAxis.value === "horizontal")
);

const verticalThumbStyle = computed<CSSProperties>(() => ({
  height: verticalThumbSize.value ? `${verticalThumbSize.value}px` : undefined,
  transform: `translateY(${verticalThumbMove.value}px)`
}));

const horizontalThumbStyle = computed<CSSProperties>(() => ({
  width: horizontalThumbSize.value ? `${horizontalThumbSize.value}px` : undefined,
  transform: `translateX(${horizontalThumbMove.value}px)`
}));

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getVerticalMetrics() {
  const wrap = wrapRef.value;

  if (!wrap) {
    return null;
  }

  const clientSize = wrap.clientHeight;
  const scrollSize = wrap.scrollHeight;
  const trackSize = Math.max(clientSize - BAR_GAP, 0);
  const overflow = scrollSize > clientSize + 1;

  if (!overflow || trackSize <= 0) {
    return {
      overflow: false,
      clientSize,
      scrollSize,
      trackSize,
      thumbSize: 0,
      thumbTravel: 0,
      scrollTravel: Math.max(scrollSize - clientSize, 0)
    };
  }

  const thumbSize = Math.max((trackSize * trackSize) / scrollSize, props.minSize);
  const resolvedThumbSize = Math.min(thumbSize, trackSize);

  return {
    overflow: true,
    clientSize,
    scrollSize,
    trackSize,
    thumbSize: resolvedThumbSize,
    thumbTravel: Math.max(trackSize - resolvedThumbSize, 0),
    scrollTravel: Math.max(scrollSize - clientSize, 0)
  };
}

function getHorizontalMetrics() {
  const wrap = wrapRef.value;

  if (!wrap) {
    return null;
  }

  const clientSize = wrap.clientWidth;
  const scrollSize = wrap.scrollWidth;
  const trackSize = Math.max(clientSize - BAR_GAP, 0);
  const overflow = scrollSize > clientSize + 1;

  if (!overflow || trackSize <= 0) {
    return {
      overflow: false,
      clientSize,
      scrollSize,
      trackSize,
      thumbSize: 0,
      thumbTravel: 0,
      scrollTravel: Math.max(scrollSize - clientSize, 0)
    };
  }

  const thumbSize = Math.max((trackSize * trackSize) / scrollSize, props.minSize);
  const resolvedThumbSize = Math.min(thumbSize, trackSize);

  return {
    overflow: true,
    clientSize,
    scrollSize,
    trackSize,
    thumbSize: resolvedThumbSize,
    thumbTravel: Math.max(trackSize - resolvedThumbSize, 0),
    scrollTravel: Math.max(scrollSize - clientSize, 0)
  };
}

function updateThumbState() {
  const wrap = wrapRef.value;

  if (!wrap || props.native) {
    verticalVisible.value = false;
    horizontalVisible.value = false;
    verticalThumbMove.value = 0;
    horizontalThumbMove.value = 0;
    return;
  }

  const verticalMetrics = getVerticalMetrics();
  const horizontalMetrics = getHorizontalMetrics();

  if (verticalMetrics) {
    verticalVisible.value = verticalMetrics.overflow;
    verticalThumbSize.value = verticalMetrics.thumbSize;
    verticalThumbMove.value =
      verticalMetrics.scrollTravel > 0
        ? (wrap.scrollTop / verticalMetrics.scrollTravel) * verticalMetrics.thumbTravel
        : 0;
  }

  if (horizontalMetrics) {
    horizontalVisible.value = horizontalMetrics.overflow;
    horizontalThumbSize.value = horizontalMetrics.thumbSize;
    horizontalThumbMove.value =
      horizontalMetrics.scrollTravel > 0
        ? (wrap.scrollLeft / horizontalMetrics.scrollTravel) * horizontalMetrics.thumbTravel
        : 0;
  }
}

function updateReachedState(
  direction: ScrollbarDirection | null,
  nextState: Record<ScrollbarDirection, boolean>
) {
  if (direction && nextState[direction] && !reachedState.value[direction]) {
    emit("endReached", direction);
  }

  reachedState.value = nextState;
}

function handleScroll() {
  const wrap = wrapRef.value;

  if (!wrap) {
    return;
  }

  const previousTop = lastScrollTop.value;
  const previousLeft = lastScrollLeft.value;
  const nextTop = wrap.scrollTop;
  const nextLeft = wrap.scrollLeft;

  lastScrollTop.value = nextTop;
  lastScrollLeft.value = nextLeft;

  updateThumbState();

  emit("scroll", {
    scrollTop: nextTop,
    scrollLeft: nextLeft
  });

  let direction: ScrollbarDirection | null = null;

  if (nextTop !== previousTop) {
    direction = nextTop > previousTop ? "bottom" : "top";
  } else if (nextLeft !== previousLeft) {
    direction = nextLeft > previousLeft ? "right" : "left";
  }

  updateReachedState(direction, {
    top: nextTop <= props.distance,
    bottom: nextTop + wrap.clientHeight >= wrap.scrollHeight - props.distance,
    left: nextLeft <= props.distance,
    right: nextLeft + wrap.clientWidth >= wrap.scrollWidth - props.distance
  });
}

function update() {
  updateThumbState();
  reachedState.value = {
    top: false,
    bottom: false,
    left: false,
    right: false
  };
}

function scrollTo(x: number, y?: number): void;
function scrollTo(options: ScrollToOptions): void;
function scrollTo(arg1: number | ScrollToOptions, arg2?: number) {
  const wrap = wrapRef.value;

  if (!wrap) {
    return;
  }

  if (typeof arg1 === "object") {
    if (typeof wrap.scrollTo === "function") {
      wrap.scrollTo(arg1);
    } else {
      if (typeof arg1.left === "number") {
        wrap.scrollLeft = arg1.left;
      }
      if (typeof arg1.top === "number") {
        wrap.scrollTop = arg1.top;
      }
    }
  } else if (typeof arg2 === "number") {
    if (typeof wrap.scrollTo === "function") {
      wrap.scrollTo(arg1, arg2);
    } else {
      wrap.scrollLeft = arg1;
      wrap.scrollTop = arg2;
    }
  }

  handleScroll();
}

function setScrollTop(value: number) {
  if (!wrapRef.value) {
    return;
  }

  wrapRef.value.scrollTop = value;
  handleScroll();
}

function setScrollLeft(value: number) {
  if (!wrapRef.value) {
    return;
  }

  wrapRef.value.scrollLeft = value;
  handleScroll();
}

function handleTrackClick(axis: "vertical" | "horizontal", event: MouseEvent) {
  const wrap = wrapRef.value;

  if (!wrap) {
    return;
  }

  const metrics = axis === "vertical" ? getVerticalMetrics() : getHorizontalMetrics();

  if (!metrics?.overflow) {
    return;
  }

  const target = event.currentTarget as HTMLElement | null;

  if (!target) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const offset = axis === "vertical" ? event.clientY - rect.top : event.clientX - rect.left;
  const thumbSize = metrics.thumbSize;
  const thumbTravel = metrics.thumbTravel;
  const scrollTravel = metrics.scrollTravel;

  if (thumbTravel <= 0 || scrollTravel <= 0) {
    return;
  }

  const nextThumbOffset = clamp(offset - thumbSize / 2, 0, thumbTravel);
  const nextScroll = (nextThumbOffset / thumbTravel) * scrollTravel;

  if (axis === "vertical") {
    wrap.scrollTop = nextScroll;
  } else {
    wrap.scrollLeft = nextScroll;
  }

  handleScroll();
}

function restoreSelection() {
  if (typeof document === "undefined") {
    return;
  }

  document.body.style.userSelect = originalUserSelect;
}

function handleDocumentMouseMove(event: MouseEvent) {
  const wrap = wrapRef.value;
  const axis = dragState.value.axis;

  if (!wrap || !axis) {
    return;
  }

  const metrics = axis === "vertical" ? getVerticalMetrics() : getHorizontalMetrics();

  if (!metrics?.overflow || metrics.thumbTravel <= 0 || metrics.scrollTravel <= 0) {
    return;
  }

  const delta =
    axis === "vertical"
      ? event.clientY - dragState.value.startClient
      : event.clientX - dragState.value.startClient;

  const nextScroll = clamp(
    dragState.value.startScroll + (delta * metrics.scrollTravel) / metrics.thumbTravel,
    0,
    metrics.scrollTravel
  );

  if (axis === "vertical") {
    wrap.scrollTop = nextScroll;
  } else {
    wrap.scrollLeft = nextScroll;
  }

  handleScroll();
}

function handleDocumentMouseUp() {
  draggingAxis.value = null;
  dragState.value = {
    axis: null,
    startClient: 0,
    startScroll: 0
  };
  restoreSelection();
  window.removeEventListener("mousemove", handleDocumentMouseMove);
  window.removeEventListener("mouseup", handleDocumentMouseUp);
}

function handleThumbMouseDown(axis: "vertical" | "horizontal", event: MouseEvent) {
  const wrap = wrapRef.value;

  if (!wrap) {
    return;
  }

  originalUserSelect = document.body.style.userSelect;
  document.body.style.userSelect = "none";

  draggingAxis.value = axis;
  dragState.value = {
    axis,
    startClient: axis === "vertical" ? event.clientY : event.clientX,
    startScroll: axis === "vertical" ? wrap.scrollTop : wrap.scrollLeft
  };

  window.addEventListener("mousemove", handleDocumentMouseMove);
  window.addEventListener("mouseup", handleDocumentMouseUp);
}

function cleanupResizeWatchers() {
  resizeObserver?.disconnect();
  resizeObserver = null;

  if (resizeListener) {
    window.removeEventListener("resize", resizeListener);
    resizeListener = null;
  }
}

function initResizeWatchers() {
  cleanupResizeWatchers();

  if (props.noresize || typeof window === "undefined") {
    return;
  }

  const handler = () => {
    update();
    handleScroll();
  };

  resizeListener = handler;
  window.addEventListener("resize", handler);

  if ("ResizeObserver" in window) {
    resizeObserver = new window.ResizeObserver(handler);

    if (wrapRef.value) {
      resizeObserver.observe(wrapRef.value);
    }

    if (viewRef.value) {
      resizeObserver.observe(viewRef.value);
    }
  }
}

watch(
  () => props.noresize,
  () => {
    nextTick(() => {
      initResizeWatchers();
      update();
      handleScroll();
    });
  }
);

watch(
  () => [props.height, props.maxHeight, props.native],
  () => {
    nextTick(() => {
      initResizeWatchers();
      update();
      handleScroll();
    });
  }
);

onMounted(() => {
  nextTick(() => {
    initResizeWatchers();
    update();
    handleScroll();
  });
});

onUpdated(() => {
  nextTick(() => {
    update();
    handleScroll();
  });
});

onBeforeUnmount(() => {
  cleanupResizeWatchers();

  if (typeof window !== "undefined") {
    window.removeEventListener("mousemove", handleDocumentMouseMove);
    window.removeEventListener("mouseup", handleDocumentMouseUp);
  }

  restoreSelection();
});

defineExpose({
  wrapRef,
  update,
  scrollTo,
  setScrollTop,
  setScrollLeft,
  handleScroll
});
</script>

<template>
  <div
    ref="scrollbarRef"
    :class="ns.base.value"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div
      ref="wrapRef"
      :class="wrapKls"
      :style="wrapStyles"
      :tabindex="props.tabindex"
      @scroll="handleScroll"
    >
      <component
        :is="props.tag"
        :id="props.id"
        ref="viewRef"
        :class="viewKls"
        :style="props.viewStyle"
        :role="props.role"
        :aria-label="props.ariaLabel"
        :aria-orientation="props.ariaOrientation"
      >
        <slot />
      </component>
    </div>

    <template v-if="!props.native">
      <div
        v-show="showVerticalBar"
        :class="[`${ns.base.value}__bar`, 'is-vertical']"
        @mousedown="handleTrackClick('vertical', $event)"
        @click.stop
      >
        <div
          :class="`${ns.base.value}__thumb`"
          :style="verticalThumbStyle"
          @mousedown.stop.prevent="handleThumbMouseDown('vertical', $event)"
        />
      </div>
      <div
        v-show="showHorizontalBar"
        :class="[`${ns.base.value}__bar`, 'is-horizontal']"
        @mousedown="handleTrackClick('horizontal', $event)"
        @click.stop
      >
        <div
          :class="`${ns.base.value}__thumb`"
          :style="horizontalThumbStyle"
          @mousedown.stop.prevent="handleThumbMouseDown('horizontal', $event)"
        />
      </div>
    </template>
  </div>
</template>
