<script setup lang="ts">
import {
  computed,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  shallowRef,
  watch
} from "vue";
import type { CSSProperties } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { AffixProps, AffixScrollPayload } from "./affix";

type ScrollContainer = HTMLElement | Window;

defineOptions({
  name: "XyAffix"
});

const props = withDefaults(defineProps<AffixProps>(), {
  zIndex: 100,
  target: "",
  offset: 0,
  position: "top",
  teleported: false,
  appendTo: "body"
});

const emit = defineEmits<{
  change: [fixed: boolean];
  scroll: [payload: AffixScrollPayload];
}>();

const ns = useNamespace("affix");
const rootRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);
const targetRef = shallowRef<HTMLElement | null>(null);
const scrollContainer = shallowRef<ScrollContainer | null>(null);

const fixed = ref(false);
const scrollTop = ref(0);
const transform = ref(0);
const rootHeight = ref(0);
const rootWidth = ref(0);
const rootTop = ref(0);
const rootBottom = ref(0);
const rootLeft = ref(0);
const viewportHeight = ref(0);
const suppressChangeEvent = ref(false);

let resizeObserver: ResizeObserver | null = null;
let removeScrollListener: (() => void) | null = null;

const teleportActive = computed(() => props.teleported && fixed.value);
const teleportTarget = computed(() => props.appendTo ?? "body");
const rootStyle = computed<CSSProperties>(() => ({
  display: "flow-root",
  height: fixed.value && rootHeight.value ? `${rootHeight.value}px` : undefined,
  width: fixed.value && rootWidth.value ? `${rootWidth.value}px` : undefined
}));
const affixStyle = computed<CSSProperties>(() => {
  if (!fixed.value) {
    return {};
  }

  return {
    height: rootHeight.value ? `${rootHeight.value}px` : undefined,
    width: rootWidth.value ? `${rootWidth.value}px` : undefined,
    left: `${rootLeft.value}px`,
    top: props.position === "top" ? addUnit(props.offset) : undefined,
    bottom: props.position === "bottom" ? addUnit(props.offset) : undefined,
    transform: transform.value ? `translateY(${transform.value}px)` : undefined,
    zIndex: props.zIndex
  };
});

function addUnit(value: number | string | undefined) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return typeof value === "number" ? `${value}px` : value;
}

function isElementContainer(value: ScrollContainer | null): value is HTMLElement {
  return typeof HTMLElement !== "undefined" && value instanceof HTMLElement;
}

function getElementRect(element: HTMLElement | null) {
  if (!element) {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0
    };
  }

  const rect = element.getBoundingClientRect();

  return {
    top: rect.top,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height
  };
}

function isScrollable(element: HTMLElement) {
  const { overflow, overflowX, overflowY } = window.getComputedStyle(element);
  const allowsScroll = /(auto|scroll|overlay)/.test(`${overflow}${overflowX}${overflowY}`);
  const hasScrollableArea =
    element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;

  return allowsScroll && hasScrollableArea;
}

function getScrollContainer(element: HTMLElement | null) {
  let current = element?.parentElement ?? null;

  while (current) {
    if (current === document.body || current === document.documentElement) {
      return window;
    }

    if (isScrollable(current)) {
      return current;
    }

    current = current.parentElement;
  }

  return window;
}

function getScrollTop(container: ScrollContainer | null) {
  if (!container) {
    return 0;
  }

  if (isElementContainer(container)) {
    return container.scrollTop;
  }

  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function resolveTarget() {
  if (props.target) {
    const nextTarget = document.querySelector<HTMLElement>(props.target);

    if (!nextTarget) {
      throw new Error(`[XyAffix] target does not exist: ${props.target}`);
    }

    targetRef.value = nextTarget;
    return;
  }

  targetRef.value = document.documentElement;
}

function measureRoot() {
  const rect = getElementRect(rootRef.value);

  rootTop.value = rect.top;
  rootBottom.value = rect.bottom;
  rootLeft.value = rect.left;
  rootWidth.value = rect.width;
  rootHeight.value = rect.height;
  viewportHeight.value = window.innerHeight || document.documentElement.clientHeight || 0;
}

function update() {
  if (!rootRef.value) {
    return;
  }

  measureRoot();
  scrollTop.value = getScrollTop(scrollContainer.value);

  const targetRect = props.target ? getElementRect(targetRef.value) : null;
  const rootHeightOffset = props.offset + rootHeight.value;
  let nextFixed = false;
  let nextTransform = 0;

  if (props.position === "top") {
    if (targetRect) {
      const difference = targetRect.bottom - rootHeightOffset;

      nextFixed = props.offset > rootTop.value && targetRect.bottom > 0;
      nextTransform = difference < 0 ? difference : 0;
    } else {
      nextFixed = props.offset > rootTop.value;
    }
  } else if (targetRect) {
    const difference = viewportHeight.value - targetRect.top - rootHeightOffset;

    nextFixed =
      viewportHeight.value - props.offset < rootBottom.value && viewportHeight.value > targetRect.top;
    nextTransform = difference < 0 ? -difference : 0;
  } else {
    nextFixed = viewportHeight.value - props.offset < rootBottom.value;
  }

  transform.value = nextFixed ? nextTransform : 0;
  fixed.value = nextFixed;
}

async function handleScroll() {
  update();
  await nextTick();

  emit("scroll", {
    scrollTop: scrollTop.value,
    fixed: fixed.value
  });
}

function syncScrollContainer() {
  scrollContainer.value = getScrollContainer(rootRef.value);
}

function disconnectScrollListener() {
  removeScrollListener?.();
  removeScrollListener = null;
}

function reconnectScrollListener() {
  disconnectScrollListener();

  if (!scrollContainer.value) {
    return;
  }

  const target = scrollContainer.value === window ? window : scrollContainer.value;
  const listener = () => {
    void handleScroll();
  };

  target.addEventListener("scroll", listener, { passive: true });
  removeScrollListener = () => {
    target.removeEventListener("scroll", listener);
  };
}

function reconnectResizeObserver() {
  resizeObserver?.disconnect();
  resizeObserver = null;

  if (typeof ResizeObserver === "undefined") {
    return;
  }

  resizeObserver = new ResizeObserver(() => {
    void updateRoot();
  });

  if (rootRef.value) {
    resizeObserver.observe(rootRef.value);
  }

  if (targetRef.value && targetRef.value !== document.documentElement) {
    resizeObserver.observe(targetRef.value);
  }

  if (isElementContainer(scrollContainer.value)) {
    resizeObserver.observe(scrollContainer.value);
  }
}

function reconnectObservers() {
  syncScrollContainer();
  reconnectScrollListener();
  reconnectResizeObserver();
}

function handleWindowResize() {
  void updateRoot();
}

async function updateRoot() {
  if (!rootRef.value) {
    return;
  }

  if (!fixed.value) {
    update();
    return;
  }

  const previousFixed = fixed.value;

  suppressChangeEvent.value = true;
  fixed.value = false;
  await nextTick();
  measureRoot();
  fixed.value = previousFixed;
  suppressChangeEvent.value = false;
  await nextTick();
  update();
}

watch(
  fixed,
  (value, oldValue) => {
    if (oldValue === undefined || suppressChangeEvent.value) {
      return;
    }

    emit("change", value);
  }
);

watch(
  () => props.target,
  async () => {
    if (!rootRef.value) {
      return;
    }

    resolveTarget();
    reconnectObservers();
    await nextTick();
    update();
  }
);

watch(
  () => [props.offset, props.position],
  () => {
    update();
  }
);

onMounted(() => {
  resolveTarget();
  reconnectObservers();
  window.addEventListener("resize", handleWindowResize, { passive: true });
  update();
});

onActivated(() => {
  void nextTick(updateRoot);
});

onDeactivated(() => {
  fixed.value = false;
  transform.value = 0;
});

onBeforeUnmount(() => {
  disconnectScrollListener();
  resizeObserver?.disconnect();
  resizeObserver = null;

  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleWindowResize);
  }
});

defineExpose({
  update,
  updateRoot
});
</script>

<template>
  <div ref="rootRef" :class="ns.base.value" :style="rootStyle">
    <div
      v-if="!teleportActive"
      ref="contentRef"
      :class="{ [`${ns.base.value}--fixed`]: fixed }"
      :style="affixStyle"
    >
      <slot />
    </div>

    <teleport v-else :to="teleportTarget">
      <div
        ref="contentRef"
        :class="{ [`${ns.base.value}--fixed`]: fixed }"
        :style="affixStyle"
      >
        <slot />
      </div>
    </teleport>
  </div>
</template>
