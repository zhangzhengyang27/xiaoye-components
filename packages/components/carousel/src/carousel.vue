<script setup lang="ts">
import { Comment, Fragment, cloneVNode, computed, isVNode, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import type { PropType, StyleValue, VNode } from "vue";
import XyIcon from "../../icon";
import {
  type CarouselAlignment,
  type CarouselArrow,
  type CarouselContainScroll,
  type CarouselDirection,
  type CarouselEffect,
  type CarouselIndicatorPosition,
  type CarouselIndicatorType,
  type CarouselProgressPlacement,
  type CarouselThumbIndicatorType,
  type CarouselThumbPlacement,
  type CarouselTrigger,
  type CarouselType
} from "./carousel";
import { carouselContextKey } from "./context";
import { useNamespace } from "@xiaoye/composables";

const props = defineProps({
  initialIndex: {
    type: Number,
    default: 0
  },
  activeIndex: {
    type: Number,
    default: undefined
  },
  height: {
    type: String,
    default: ""
  },
  trigger: {
    type: String as PropType<CarouselTrigger>,
    default: "hover"
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 3000
  },
  indicatorPosition: {
    type: String as PropType<CarouselIndicatorPosition>,
    default: ""
  },
  arrow: {
    type: String as PropType<CarouselArrow>,
    default: "hover"
  },
  type: {
    type: String as PropType<CarouselType>,
    default: ""
  },
  cardScale: {
    type: Number,
    default: 0.83
  },
  loop: {
    type: Boolean,
    default: true
  },
  direction: {
    type: String as PropType<CarouselDirection>,
    default: "horizontal"
  },
  pauseOnHover: {
    type: Boolean,
    default: true
  },
  draggable: {
    type: Boolean,
    default: true
  },
  effect: {
    type: String as PropType<CarouselEffect>,
    default: "slide"
  },
  duration: {
    type: Number,
    default: 400
  },
  easing: {
    type: String,
    default: "cubic-bezier(0.22, 0.61, 0.36, 1)"
  },
  slidesPerView: {
    type: Number,
    default: 1
  },
  slidesPerGroup: {
    type: Number,
    default: 1
  },
  gap: {
    type: [Number, String],
    default: 0
  },
  centered: {
    type: Boolean,
    default: false
  },
  indicatorType: {
    type: String as PropType<CarouselIndicatorType>,
    default: "line"
  },
  thumbs: {
    type: Boolean,
    default: false
  },
  thumbsPlacement: {
    type: String as PropType<CarouselThumbPlacement>,
    default: "bottom"
  },
  thumbsPerView: {
    type: Number,
    default: 5
  },
  thumbsGap: {
    type: [Number, String],
    default: 8
  },
  thumbsIndicatorType: {
    type: String as PropType<CarouselThumbIndicatorType>,
    default: "thumbnail"
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  progressPlacement: {
    type: String as PropType<CarouselProgressPlacement>,
    default: "bottom"
  },
  progressColor: {
    type: String,
    default: ""
  },
  align: {
    type: String as PropType<CarouselAlignment>,
    default: "start"
  },
  containScroll: {
    type: String as PropType<CarouselContainScroll>,
    default: "trim"
  },
  peek: {
    type: [Number, String],
    default: 0
  },
  lazy: {
    type: Boolean,
    default: false
  },
  lazyRange: {
    type: Number,
    default: 1
  },
  virtual: {
    type: Boolean,
    default: false
  },
  virtualBuffer: {
    type: Number,
    default: 1
  },
  ariaLabel: {
    type: String,
    default: ""
  },
  keyboard: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
  change: [current: number, previous: number];
  "update:activeIndex": [value: number];
}>();

const slots = defineSlots<{
  default?: () => unknown;
  indicator?: (props: { index: number; active: boolean; total: number }) => unknown;
  "arrow-prev"?: (props: { disabled: boolean }) => unknown;
  "arrow-next"?: (props: { disabled: boolean }) => unknown;
  progress?: (props: { percent: number; activeIndex: number }) => unknown;
  thumb?: (props: { index: number; active: boolean; total: number; item: { name?: string; label?: string | number } }) => unknown;
}>();

const ns = useNamespace("carousel");
const root = ref<HTMLElement | null>(null);
const viewport = ref<HTMLElement | null>(null);
const viewportSize = ref(0);
const internalActiveIndex = ref(-1);
const previousIndex = ref(-1);
const items = ref<import("./context").CarouselItemRegistration[]>([]);
const hover = ref(false);
const initialized = ref(false);
const dragging = ref(false);
const autoplaySuspended = ref(false);
const dragOffset = ref(0);
const dragMoved = ref(false);
const dragPointerId = ref<number | null>(null);
const dragStart = ref(0);
const heightObserver = ref<ResizeObserver | null>(null);
const progressFrame = ref<number | null>(null);
const progressPercent = ref(0);
const autoHeight = ref(0);
const thumbRefs = new Map<number, HTMLElement>();
let timer: ReturnType<typeof setTimeout> | null = null;
let autoplayResumeTimer: ReturnType<typeof setTimeout> | null = null;
let resizeObserver: ResizeObserver | null = null;
let progressStart = 0;
let progressDuration = 0;
let timerToken = 0;

function toPxNumber(value: string | number) {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

const isControlled = computed(() => props.activeIndex !== undefined);
const isCardType = computed(() => props.type === "card");
const isVertical = computed(() => props.direction === "vertical");
const alignMode = computed<CarouselAlignment>(() => (props.centered ? "center" : props.align));
const slidesPerViewValue = computed(() => Math.max(props.slidesPerView, 1));
const slidesPerGroupValue = computed(() => Math.max(Math.floor(props.slidesPerGroup), 1));
const thumbsPerViewValue = computed(() => Math.max(Math.floor(props.thumbsPerView), 1));
const gapPx = computed(() => toPxNumber(props.gap));
const thumbsGapPx = computed(() => toPxNumber(props.thumbsGap));
const peekPx = computed(() => toPxNumber(props.peek));
const isFadeEffect = computed(
  () =>
    props.effect === "fade" &&
    !isCardType.value &&
    slidesPerViewValue.value === 1 &&
    !props.centered
);
const logicalSlideNodes = computed(() => flattenSlideNodes(slots.default?.()));
const logicalSlideCount = computed(() => logicalSlideNodes.value.length);
const isTwoLengthLoop = computed(
  () =>
    props.loop &&
    !isCardType.value &&
    !isFadeEffect.value &&
    slidesPerViewValue.value === 1 &&
    slidesPerGroupValue.value === 1 &&
    !props.centered &&
    logicalSlideCount.value === 2
);
const placeholderSlideNodes = computed(() => {
  if (!isTwoLengthLoop.value) {
    return [];
  }

  return logicalSlideNodes.value.map((node, index) =>
    cloneVNode(node, {
      key: `xy-carousel-placeholder-${index}`
    })
  );
});
const thumbsEnabled = computed(() => props.thumbs && !isCardType.value);
const hasLabel = computed(() => items.value.some((item) => `${item.props.label ?? ""}`.length > 0));
const arrowDisplay = computed(() => props.arrow !== "never" && !isVertical.value);
const showIndicators = computed(() => props.indicatorPosition !== "none");

const maxIndex = computed(() => {
  const total = items.value.length;
  if (!total) {
    return -1;
  }

  if (isCardType.value || isFadeEffect.value || alignMode.value === "center") {
    return total - 1;
  }

  if (props.containScroll === "keep") {
    return total - 1;
  }

  if (alignMode.value === "end") {
    return total - 1;
  }

  return Math.max(total - Math.ceil(slidesPerViewValue.value), 0);
});

const snapPoints = computed(() => {
  const total = items.value.length;
  if (!total) {
    return [];
  }

  const points: number[] = [];

  if (isCardType.value || isFadeEffect.value || alignMode.value === "center") {
    for (let index = 0; index < total; index += slidesPerGroupValue.value) {
      points.push(index);
    }

    if (points[points.length - 1] !== total - 1) {
      points.push(total - 1);
    }

    return points;
  }

  if (alignMode.value === "end") {
    const startIndex = Math.max(Math.ceil(slidesPerViewValue.value) - 1, 0);
    for (let index = startIndex; index < total; index += slidesPerGroupValue.value) {
      points.push(index);
    }

    if (!points.length) {
      points.push(total - 1);
    } else if (points[points.length - 1] !== total - 1) {
      points.push(total - 1);
    }

    return points;
  }

  for (let index = 0; index <= maxIndex.value; index += slidesPerGroupValue.value) {
    points.push(index);
  }

  if (!points.length) {
    points.push(0);
  } else if (points[points.length - 1] !== maxIndex.value) {
    points.push(maxIndex.value);
  }

  return points;
});

const resolvedActiveIndex = computed(() => {
  const raw = isControlled.value ? props.activeIndex ?? -1 : internalActiveIndex.value;
  if (!items.value.length) {
    return -1;
  }

  if (props.loop && snapPoints.value.length) {
    const normalized = (raw % items.value.length + items.value.length) % items.value.length;
    return snapPoints.value.includes(normalized) ? normalized : snapPoints.value[0];
  }

  return Math.min(Math.max(raw, 0), maxIndex.value);
});

const activeIndicatorIndex = computed(() => {
  const current = resolvedActiveIndex.value;
  if (current < 0 || !snapPoints.value.length) {
    return -1;
  }

  return snapPoints.value.findIndex((point) => point === current);
});
const exposedActiveIndex = computed(() => {
  if (resolvedActiveIndex.value < 0) {
    return resolvedActiveIndex.value;
  }

  return isTwoLengthLoop.value ? resolvedActiveIndex.value % logicalSlideCount.value : resolvedActiveIndex.value;
});

const visibleIndices = computed(() => {
  const total = items.value.length;
  const current = resolvedActiveIndex.value;

  if (!total || current < 0) {
    return [];
  }

  if (isCardType.value || isFadeEffect.value) {
    return [current];
  }

  const visibleCount = Math.ceil(slidesPerViewValue.value);

  if (alignMode.value === "center") {
    const before = Math.floor((visibleCount - 1) / 2);
    const after = visibleCount - before - 1;
    const indices: number[] = [];

    for (let offset = -before; offset <= after; offset += 1) {
      const next = current + offset;
      if (props.loop) {
        indices.push((next % total + total) % total);
      } else if (next >= 0 && next < total) {
        indices.push(next);
      }
    }

    return Array.from(new Set(indices));
  }

  if (alignMode.value === "end") {
    const start = current - visibleCount + 1;
    return Array.from({ length: visibleCount }, (_, offset) => start + offset).filter(
      (index) => index >= 0 && index < total
    );
  }

  return Array.from({ length: visibleCount }, (_, offset) => current + offset).filter(
    (index) => index >= 0 && index < total
  );
});

const renderIndices = computed(() => {
  if (!items.value.length) {
    return new Set<number>();
  }

  if (!props.lazy && !props.virtual) {
    return new Set(Array.from({ length: items.value.length }, (_, index) => index));
  }

  const buffer = props.virtual ? Math.max(props.virtualBuffer, 0) : Math.max(props.lazyRange, 0);
  const indices = new Set<number>();
  const total = items.value.length;

  visibleIndices.value.forEach((baseIndex) => {
    for (let offset = -buffer; offset <= buffer; offset += 1) {
      const next = baseIndex + offset;

      if (props.loop) {
        indices.add((next % total + total) % total);
      } else if (next >= 0 && next < total) {
        indices.add(next);
      }
    }
  });

  return indices;
});

const carouselClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.direction}`,
  isCardType.value ? `${ns.base.value}--card` : "",
  isFadeEffect.value ? `${ns.base.value}--fade` : "",
  props.indicatorType === "dot" ? `${ns.base.value}--indicator-dot` : "",
  props.centered ? "is-centered" : "",
  props.virtual ? "is-virtual" : "",
  props.lazy ? "is-lazy" : "",
  isVertical.value && props.indicatorPosition === "outside" ? "is-vertical-outside" : "",
  dragging.value ? "is-dragging" : "",
  thumbsEnabled.value ? `is-thumbs-${props.thumbsPlacement}` : ""
]);

const indicatorsClasses = computed(() => [
  `${ns.base.value}__indicators`,
  `${ns.base.value}__indicators--${props.direction}`,
  props.indicatorPosition === "outside" ? `${ns.base.value}__indicators--outside` : "",
  isVertical.value ? `${ns.base.value}__indicators--right` : "",
  hasLabel.value ? `${ns.base.value}__indicators--labels` : "",
  `${ns.base.value}__indicators--${props.indicatorType}`
]);

const controlsClasses = computed(() => [
  `${ns.base.value}__controls`,
  `${ns.base.value}__controls--${props.indicatorPosition === "outside" ? "outside" : "inside"}`,
  `${ns.base.value}__controls--${props.direction}`
]);

const thumbsClasses = computed(() => [
  `${ns.base.value}__thumbs`,
  `${ns.base.value}__thumbs--${props.thumbsPlacement}`,
  `${ns.base.value}__thumbs--${props.thumbsIndicatorType}`
]);

const thumbsTrackStyle = computed<StyleValue>(() => {
  const size = thumbsPerViewValue.value;
  const gap = `${thumbsGapPx.value}px`;

  if (props.thumbsPlacement === "left" || props.thumbsPlacement === "right") {
    return {
      gap,
      gridAutoFlow: "row",
      gridAutoRows: `calc((100% - ${thumbsGapPx.value * (size - 1)}px) / ${size})`
    };
  }

  return {
    gap,
    gridAutoFlow: "column",
    gridAutoColumns: `calc((100% - ${thumbsGapPx.value * (size - 1)}px) / ${size})`
  };
});

const progressStyle = computed<StyleValue>(() => ({
  width: `${progressPercent.value}%`,
  backgroundColor: props.progressColor || undefined
}));

const mainViewportStyle = computed<StyleValue>(() => {
  if (props.height === "auto") {
    return {
      height: autoHeight.value > 0 ? `${autoHeight.value}px` : undefined
    };
  }

  return {
    height: props.height || undefined
  };
});

function toLeadDuration(index: number) {
  return items.value[index]?.props.duration ?? props.interval;
}

function flattenSlideNodes(nodes: unknown): VNode[] {
  if (!Array.isArray(nodes)) {
    return [];
  }

  const result: VNode[] = [];

  nodes.forEach((node) => {
    if (!isVNode(node) || node.type === Comment) {
      return;
    }

    if (node.type === Fragment) {
      result.push(...flattenSlideNodes(Array.isArray(node.children) ? node.children : []));
      return;
    }

    result.push(node);
  });

  return result;
}

function isTwoLengthVisible(index: number) {
  if (!isTwoLengthLoop.value) {
    return true;
  }

  return resolvedActiveIndex.value <= 1 ? index <= 1 : index > 1;
}

function toLogicalIndex(index: number) {
  if (!isTwoLengthLoop.value || logicalSlideCount.value <= 0) {
    return index;
  }

  return index % logicalSlideCount.value;
}

function updateViewportSize() {
  if (!viewport.value) {
    viewportSize.value = 0;
    return;
  }

  viewportSize.value = isVertical.value ? viewport.value.offsetHeight : viewport.value.offsetWidth;
}

function clearProgress(resetPercent = true) {
  if (progressFrame.value !== null) {
    cancelAnimationFrame(progressFrame.value);
    progressFrame.value = null;
  }
  if (resetPercent) {
    progressPercent.value = 0;
  }
}

function updateProgressFrame(timestamp: number) {
  if (!props.showProgress || progressDuration <= 0) {
    progressPercent.value = 0;
    return;
  }

  const elapsed = timestamp - progressStart;
  progressPercent.value = Math.min((elapsed / progressDuration) * 100, 100);

  if (progressPercent.value < 100) {
    progressFrame.value = requestAnimationFrame(updateProgressFrame);
  }
}

function pauseTimer(options?: {
  preserveProgress?: boolean;
  progressPercent?: number | null;
}) {
  timerToken += 1;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  clearProgress(!options?.preserveProgress);

  if (options?.preserveProgress && options.progressPercent !== undefined && options.progressPercent !== null) {
    progressPercent.value = options.progressPercent;
  }
}

function clearAutoplayResumeTimer() {
  if (autoplayResumeTimer) {
    clearTimeout(autoplayResumeTimer);
    autoplayResumeTimer = null;
  }
}

function scheduleAutoplayResume(delay = 0) {
  clearAutoplayResumeTimer();

  if (!autoplaySuspended.value) {
    resetTimer();
    return;
  }

  autoplayResumeTimer = setTimeout(() => {
    autoplayResumeTimer = null;
    autoplaySuspended.value = false;
    resetTimer();
  }, Math.max(delay, 0));
}

function getNextAutoplayIndex() {
  if (!snapPoints.value.length) {
    return resolvedActiveIndex.value;
  }

  const currentIndicator = activeIndicatorIndex.value < 0 ? 0 : activeIndicatorIndex.value;

  for (let step = 1; step <= snapPoints.value.length; step += 1) {
    const nextIndicator = props.loop
      ? (currentIndicator + step) % snapPoints.value.length
      : Math.min(currentIndicator + step, snapPoints.value.length - 1);
    const nextIndex = snapPoints.value[nextIndicator] ?? resolvedActiveIndex.value;

    if (!items.value[nextIndex]?.props.autoplayDisabled) {
      return nextIndex;
    }

    if (!props.loop && nextIndicator === snapPoints.value.length - 1) {
      break;
    }
  }

  return resolvedActiveIndex.value;
}

function startTimer() {
  if (!props.autoplay || items.value.length <= 1 || timer || dragging.value || autoplaySuspended.value) {
    return;
  }

  const delay = toLeadDuration(resolvedActiveIndex.value < 0 ? 0 : resolvedActiveIndex.value);
  if (delay <= 0) {
    return;
  }

  const runToken = ++timerToken;

  if (props.showProgress) {
    progressDuration = delay;
    progressStart = performance.now();
    progressPercent.value = 0;
    progressFrame.value = requestAnimationFrame(updateProgressFrame);
  }

  timer = setTimeout(() => {
    timer = null;

    if (runToken !== timerToken || dragging.value) {
      return;
    }

    const target = getNextAutoplayIndex();
    if (target !== resolvedActiveIndex.value) {
      setActiveItem(target);
    } else {
      resetTimer();
    }
  }, delay);
}

function resetTimer() {
  pauseTimer();
  if ((!props.pauseOnHover || !hover.value) && !dragging.value && !autoplaySuspended.value) {
    startTimer();
  }
}

function emitChange(nextIndex: number, previous: number) {
  if (previous > -1 && previous !== nextIndex) {
    emit("change", toLogicalIndex(nextIndex), toLogicalIndex(previous));
  }
}

function updateAutoHeight() {
  if (props.height !== "auto") {
    autoHeight.value = 0;
    return;
  }

  const indices =
    props.virtual && slidesPerViewValue.value > 1 ? [resolvedActiveIndex.value] : visibleIndices.value;
  const heights = indices
    .map((index) => items.value[index]?.getEl()?.offsetHeight ?? 0)
    .filter((height) => height > 0);

  autoHeight.value = heights.length ? Math.max(...heights) : 0;
}

function observeVisibleItems() {
  heightObserver.value?.disconnect();
  heightObserver.value = null;

  if (props.height !== "auto" || typeof ResizeObserver === "undefined") {
    return;
  }

  const observeIndices =
    props.virtual && slidesPerViewValue.value > 1 ? [resolvedActiveIndex.value] : visibleIndices.value;
  const elements = observeIndices
    .map((index) => items.value[index]?.getEl())
    .filter((element): element is HTMLElement => Boolean(element));

  if (!elements.length) {
    return;
  }

  heightObserver.value = new ResizeObserver(() => {
    updateAutoHeight();
  });

  elements.forEach((element) => {
    heightObserver.value?.observe(element);
  });
}

function scrollActiveThumbIntoView() {
  const activeThumb = thumbRefs.get(resolvedActiveIndex.value);
  if (activeThumb && typeof activeThumb.scrollIntoView === "function") {
    activeThumb.scrollIntoView({
      block: "nearest",
      inline: "nearest"
    });
  }
}

function resolveTargetIndex(index: number | string) {
  if (!items.value.length) {
    return -1;
  }

  let nextIndex = index;

  if (typeof nextIndex === "string") {
    const targetIndex = items.value.findIndex((item) => item.props.name === nextIndex);
    if (targetIndex < 0) {
      return -1;
    }
    nextIndex = targetIndex;
  }

  if (!Number.isInteger(nextIndex)) {
    return -1;
  }

  if (isCardType.value || isFadeEffect.value || alignMode.value === "center") {
    if (props.loop) {
      const total = items.value.length;
      return (nextIndex % total + total) % total;
    }

    return Math.min(Math.max(nextIndex, 0), items.value.length - 1);
  }

  if (props.loop) {
    const total = snapPoints.value.length || 1;
    const normalized = (nextIndex % total + total) % total;
    return snapPoints.value[normalized] ?? 0;
  }

  return Math.min(Math.max(nextIndex, 0), maxIndex.value);
}

function setActiveItem(index: number | string) {
  const nextIndex = resolveTargetIndex(index);

  if (nextIndex < 0) {
    return;
  }

  const currentIndex = resolvedActiveIndex.value;
  if (nextIndex === currentIndex) {
    previousIndex.value = currentIndex;
    resetTimer();
    return;
  }

  const previous = currentIndex;
  previousIndex.value = previous;

  if (isControlled.value) {
    emit("update:activeIndex", toLogicalIndex(nextIndex));
  } else {
    internalActiveIndex.value = nextIndex;
  }

  resetTimer();
  emitChange(nextIndex, previous);
}

function prev() {
  if (!snapPoints.value.length) {
    return;
  }

  const current = activeIndicatorIndex.value < 0 ? 0 : activeIndicatorIndex.value;
  const target = current <= 0 ? (props.loop ? snapPoints.value.length - 1 : 0) : current - 1;
  setActiveItem(snapPoints.value[target] ?? 0);
}

function next() {
  if (!snapPoints.value.length) {
    return;
  }

  const current = activeIndicatorIndex.value < 0 ? 0 : activeIndicatorIndex.value;
  const target =
    current >= snapPoints.value.length - 1
      ? (props.loop ? 0 : current)
      : current + 1;

  setActiveItem(snapPoints.value[target] ?? 0);
}

function registerItem(item: import("./context").CarouselItemRegistration) {
  if (items.value.some((current) => current.uid === item.uid)) {
    return;
  }

  items.value = [...items.value, item];

  nextTick(() => {
    updateViewportSize();
    if (initialized.value && !isControlled.value && internalActiveIndex.value < 0 && items.value.length) {
      internalActiveIndex.value = resolveTargetIndex(props.initialIndex);
    }
    updateAutoHeight();
    observeVisibleItems();
    scrollActiveThumbIntoView();
    resetTimer();
  });
}

function unregisterItem(uid: number) {
  const nextItems = items.value.filter((item) => item.uid !== uid);
  if (nextItems.length === items.value.length) {
    return;
  }

  items.value = nextItems;

  if (!nextItems.length) {
    internalActiveIndex.value = -1;
    pauseTimer();
    return;
  }

  if (!isControlled.value && resolvedActiveIndex.value >= nextItems.length) {
    internalActiveIndex.value = resolveTargetIndex(nextItems.length - 1);
  }

  nextTick(() => {
    updateViewportSize();
    updateAutoHeight();
    observeVisibleItems();
    scrollActiveThumbIntoView();
    resetTimer();
  });
}

function handleMouseEnter() {
  hover.value = true;
  if (props.pauseOnHover) {
    pauseTimer();
  }
}

function handleMouseLeave() {
  hover.value = false;
  if (!dragging.value) {
    startTimer();
  }
}

function handleIndicatorHover(index: number) {
  if (props.trigger !== "hover") {
    return;
  }

  setActiveItem(snapPoints.value[index] ?? index);
}

function handleIndicatorClick(index: number) {
  setActiveItem(snapPoints.value[index] ?? index);
}

function shouldStartDrag(event: PointerEvent) {
  if (!props.draggable || items.value.length <= 1) {
    return false;
  }

  if ((event.target as HTMLElement | null)?.closest(".xy-carousel__arrow")) {
    return false;
  }

  if ((event.target as HTMLElement | null)?.closest(".xy-carousel__indicators")) {
    return false;
  }

  if ((event.target as HTMLElement | null)?.closest(".xy-carousel__thumbs")) {
    return false;
  }

  return true;
}

function getAxisValue(event: PointerEvent) {
  return isVertical.value ? event.clientY : event.clientX;
}

function handlePointerMove(event: PointerEvent) {
  if (!dragging.value || dragPointerId.value !== event.pointerId) {
    return;
  }

  dragOffset.value = getAxisValue(event) - dragStart.value;
  if (Math.abs(dragOffset.value) > 3) {
    dragMoved.value = true;
  }
}

function finishDrag(event: PointerEvent) {
  if (dragPointerId.value !== event.pointerId) {
    return;
  }

  const delta = dragOffset.value;
  const threshold = Math.max(24, viewportSize.value * 0.1);

  dragging.value = false;
  dragPointerId.value = null;
  dragOffset.value = 0;

  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerup", finishDrag);
  window.removeEventListener("pointercancel", finishDrag);

  if (Math.abs(delta) >= threshold) {
    if (delta < 0) {
      next();
    } else {
      prev();
    }
  }

  scheduleAutoplayResume(props.duration);

  window.setTimeout(() => {
    dragMoved.value = false;
  }, 0);
}

function handlePointerDown(event: PointerEvent) {
  if (!shouldStartDrag(event)) {
    return;
  }

  dragging.value = true;
  autoplaySuspended.value = true;
  dragMoved.value = false;
  dragPointerId.value = event.pointerId;
  dragStart.value = getAxisValue(event);
  dragOffset.value = 0;
  pauseTimer();

  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", finishDrag);
  window.addEventListener("pointercancel", finishDrag);
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.keyboard) {
    return;
  }

  if (isVertical.value) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      prev();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      next();
    }
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    prev();
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    next();
  }

  if (event.key === "Home") {
    event.preventDefault();
    setActiveItem(snapPoints.value[0] ?? 0);
  }

  if (event.key === "End") {
    event.preventDefault();
    setActiveItem(snapPoints.value[snapPoints.value.length - 1] ?? 0);
  }
}

function handleFocusIn() {
  pauseTimer();
}

function handleFocusOut() {
  if (!dragging.value) {
    startTimer();
  }
}

function renderThumbLabel(index: number) {
  return `${items.value[index]?.props.label ?? index + 1}`;
}

function setThumbRef(index: number, element: unknown) {
  if (!(element instanceof HTMLElement)) {
    thumbRefs.delete(index);
    return;
  }

  thumbRefs.set(index, element);
}

provide(carouselContextKey, {
  root,
  viewport,
  viewportSize,
  items,
  resolvedActiveIndex,
  previousIndex,
  activeIndicatorIndex,
  isCardType,
  isVertical,
  isFadeEffect,
  loop: computed(() => props.loop),
  trigger: computed(() => props.trigger),
  cardScale: computed(() => props.cardScale),
  duration: computed(() => props.duration),
  easing: computed(() => props.easing),
  slidesPerView: slidesPerViewValue,
  slidesPerGroup: slidesPerGroupValue,
  centered: computed(() => props.centered || alignMode.value === "center"),
  gapPx,
  peekPx,
  dragOffset,
  dragging,
  lazy: computed(() => props.lazy),
  virtual: computed(() => props.virtual),
  renderIndices,
  registerItem,
  unregisterItem,
  setActiveItem
});

watch(
  () => [props.autoplay, props.interval, props.pauseOnHover, items.value.length, resolvedActiveIndex.value],
  () => {
    resetTimer();
  }
);

watch(
  () => [props.height, resolvedActiveIndex.value, slidesPerViewValue.value, props.centered, props.direction, props.gap, props.peek, props.virtual],
  () => {
    nextTick(() => {
      updateViewportSize();
      updateAutoHeight();
      observeVisibleItems();
      scrollActiveThumbIntoView();
    });
  }
);

watch(
  () => props.activeIndex,
  () => {
    if (!isControlled.value) {
      return;
    }

    nextTick(() => {
      updateAutoHeight();
      observeVisibleItems();
      scrollActiveThumbIntoView();
    });
  }
);

watch(
  () => props.direction,
  () => {
    nextTick(updateViewportSize);
  }
);

onMounted(() => {
  initialized.value = true;

  if (!isControlled.value && items.value.length) {
    internalActiveIndex.value = resolveTargetIndex(props.initialIndex);
  }

  nextTick(() => {
    updateViewportSize();
    updateAutoHeight();
    observeVisibleItems();
    scrollActiveThumbIntoView();
    resetTimer();
  });

  if (typeof ResizeObserver !== "undefined" && viewport.value) {
    resizeObserver = new ResizeObserver(() => {
      updateViewportSize();
      updateAutoHeight();
    });
    resizeObserver.observe(viewport.value);
  }
});

onBeforeUnmount(() => {
  pauseTimer();
  clearAutoplayResumeTimer();
  resizeObserver?.disconnect();
  heightObserver.value?.disconnect();
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerup", finishDrag);
  window.removeEventListener("pointercancel", finishDrag);
});

defineExpose({
  activeIndex: exposedActiveIndex,
  setActiveItem,
  prev,
  next
});

const PlaceholderItems = () => placeholderSlideNodes.value;
</script>

<template>
  <div
    ref="root"
    :class="carouselClasses"
    tabindex="0"
    :aria-label="props.ariaLabel || undefined"
    aria-roledescription="carousel"
    aria-live="polite"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @keydown="handleKeydown"
    @pointerdown="handlePointerDown"
  >
    <div
      v-if="thumbsEnabled && (props.thumbsPlacement === 'top' || props.thumbsPlacement === 'left')"
      :class="thumbsClasses"
    >
      <div class="xy-carousel__thumbs-track" :style="thumbsTrackStyle">
        <button
          v-for="(item, index) in items"
          :key="`thumb-${item.uid}`"
          :ref="(el) => setThumbRef(index, el)"
          v-show="isTwoLengthVisible(index)"
          :class="[
            'xy-carousel__thumb',
            `xy-carousel__thumb--${props.thumbsIndicatorType}`,
            index === resolvedActiveIndex ? 'is-active' : ''
          ]"
          type="button"
          :aria-label="`thumbnail ${toLogicalIndex(index) + 1}`"
          @click="setActiveItem(index)"
        >
          <slot
            v-if="slots.thumb"
            name="thumb"
            :index="toLogicalIndex(index)"
            :active="index === resolvedActiveIndex"
            :total="logicalSlideCount || items.length"
            :item="item.props"
          />
          <template v-else>
            {{ renderThumbLabel(index) }}
          </template>
        </button>
      </div>
    </div>

    <div class="xy-carousel__main">
      <div v-if="props.showProgress && props.progressPlacement === 'top'" class="xy-carousel__progress xy-carousel__progress--top">
        <slot name="progress" :percent="progressPercent" :active-index="exposedActiveIndex">
          <span class="xy-carousel__progress-bar" :style="progressStyle" />
        </slot>
      </div>

      <transition name="xy-carousel-arrow-left">
        <button
          v-if="arrowDisplay"
          v-show="(props.arrow === 'always' || hover) && (props.loop || resolvedActiveIndex > 0)"
          type="button"
          class="xy-carousel__arrow xy-carousel__arrow--left"
          aria-label="previous slide"
          @click.stop="prev"
        >
          <slot name="arrow-prev" :disabled="!props.loop && resolvedActiveIndex <= 0">
            <XyIcon icon="mdi:chevron-left" :size="18" />
          </slot>
        </button>
      </transition>

      <transition name="xy-carousel-arrow-right">
        <button
          v-if="arrowDisplay"
          v-show="(props.arrow === 'always' || hover) && (props.loop || resolvedActiveIndex < maxIndex)"
          type="button"
          class="xy-carousel__arrow xy-carousel__arrow--right"
          aria-label="next slide"
          @click.stop="next"
        >
          <slot name="arrow-next" :disabled="!props.loop && resolvedActiveIndex >= maxIndex">
            <XyIcon icon="mdi:chevron-right" :size="18" />
          </slot>
        </button>
      </transition>

      <div
        ref="viewport"
        class="xy-carousel__container"
        :style="mainViewportStyle"
      >
        <PlaceholderItems />
        <slot />
      </div>

      <div v-if="props.showProgress && props.progressPlacement === 'bottom'" class="xy-carousel__progress xy-carousel__progress--bottom">
        <slot name="progress" :percent="progressPercent" :active-index="exposedActiveIndex">
          <span class="xy-carousel__progress-bar" :style="progressStyle" />
        </slot>
      </div>

      <div v-if="showIndicators || (props.showProgress && props.progressPlacement === 'indicator')" :class="controlsClasses">
        <ul v-if="showIndicators" :class="indicatorsClasses">
          <li
            v-for="(snapPoint, index) in snapPoints"
            :key="`indicator-${snapPoint}`"
            v-show="isTwoLengthVisible(index)"
            :class="[
              'xy-carousel__indicator',
              `xy-carousel__indicator--${props.direction}`,
              index === activeIndicatorIndex ? 'is-active' : ''
            ]"
            @mouseenter="handleIndicatorHover(index)"
            @click.stop="handleIndicatorClick(index)"
          >
              <button
                type="button"
                :class="[
                  'xy-carousel__button',
                  slots.indicator ? 'xy-carousel__button--custom' : ''
                ]"
              :aria-label="`slide ${toLogicalIndex(snapPoint) + 1}`"
            >
                <slot
                  v-if="slots.indicator"
                  name="indicator"
                  :index="toLogicalIndex(index)"
                  :active="index === activeIndicatorIndex"
                  :total="logicalSlideCount || snapPoints.length"
                />
              <template v-else>
                <span v-if="hasLabel">{{ items[snapPoint]?.props.label }}</span>
              </template>
            </button>
          </li>
        </ul>

        <div v-if="props.showProgress && props.progressPlacement === 'indicator'" class="xy-carousel__progress xy-carousel__progress--indicator">
          <slot name="progress" :percent="progressPercent" :active-index="exposedActiveIndex">
            <span class="xy-carousel__progress-bar" :style="progressStyle" />
          </slot>
        </div>
      </div>
    </div>

    <div
      v-if="thumbsEnabled && (props.thumbsPlacement === 'bottom' || props.thumbsPlacement === 'right')"
      :class="thumbsClasses"
    >
      <div class="xy-carousel__thumbs-track" :style="thumbsTrackStyle">
        <button
          v-for="(item, index) in items"
          :key="`thumb-${item.uid}`"
          :ref="(el) => setThumbRef(index, el)"
          v-show="isTwoLengthVisible(index)"
          :class="[
            'xy-carousel__thumb',
            `xy-carousel__thumb--${props.thumbsIndicatorType}`,
            index === resolvedActiveIndex ? 'is-active' : ''
          ]"
          type="button"
          :aria-label="`thumbnail ${toLogicalIndex(index) + 1}`"
          @click="setActiveItem(index)"
        >
          <slot
            v-if="slots.thumb"
            name="thumb"
            :index="toLogicalIndex(index)"
            :active="index === resolvedActiveIndex"
            :total="logicalSlideCount || items.length"
            :item="item.props"
          />
          <template v-else>
            {{ renderThumbLabel(index) }}
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
