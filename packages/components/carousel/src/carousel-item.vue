<script setup lang="ts">
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, ref } from "vue";
import type { CSSProperties } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { carouselContextKey } from "./context";
import type { CarouselItemProps } from "./carousel-item";

const props = withDefaults(defineProps<CarouselItemProps>(), {
  name: "",
  label: "",
  duration: undefined,
  autoplayDisabled: false
});
const ns = useNamespace("carousel");
const carousel = inject(carouselContextKey, null);
const uid = getCurrentInstance()?.uid ?? Math.random();
const itemRef = ref<HTMLElement | null>(null);

function processIndex(index: number, activeIndex: number, length: number) {
  if (length <= 2) {
    return index;
  }

  const lastItemIndex = length - 1;
  const prevItemIndex = activeIndex - 1;
  const nextItemIndex = activeIndex + 1;
  const halfItemIndex = length / 2;

  if (activeIndex === 0 && index === lastItemIndex) {
    return -1;
  }

  if (activeIndex === lastItemIndex && index === 0) {
    return length;
  }

  if (index < prevItemIndex && activeIndex - index >= halfItemIndex) {
    return length + 1;
  }

  if (index > nextItemIndex && index - activeIndex >= halfItemIndex) {
    return -2;
  }

  return index;
}

function processSlideLoopIndex(index: number, activeIndex: number, length: number) {
  if (length <= 1) {
    return index;
  }

  const lastItemIndex = length - 1;

  if (activeIndex === 0 && index === lastItemIndex) {
    return -1;
  }

  if (activeIndex === lastItemIndex && index === 0) {
    return length;
  }

  return index;
}

function resolveSeamlessTrackIndex(
  index: number,
  activeIndex: number,
  length: number,
  direction: "next" | "prev" | null
) {
  if (length <= 1) {
    return index;
  }

  if (direction === "next") {
    return index === 0 ? length : index;
  }

  if (direction === "prev") {
    return index === length - 1 ? -1 : index;
  }

  return processSlideLoopIndex(index, activeIndex, length);
}

const index = computed(() =>
  carousel ? carousel.items.value.findIndex((item) => item.uid === uid) : -1
);
const ready = computed(() => index.value >= 0);
const processedIndex = computed(() => {
  if (!carousel || index.value < 0) {
    return index.value;
  }

  if (!carousel.loop.value || carousel.items.value.length <= 1) {
    return index.value;
  }

  return processIndex(index.value, carousel.resolvedActiveIndex.value, carousel.items.value.length);
});
const active = computed(() => carousel?.resolvedActiveIndex.value === index.value);
const seamlessLoop = computed(() => {
  if (!carousel) {
    return false;
  }

  return (
    carousel.loop.value &&
    !carousel.isCardType.value &&
    !carousel.isFadeEffect.value &&
    carousel.slidesPerView.value === 1 &&
    !carousel.centered.value
  );
});
const inStage = computed(() => {
  if (!carousel?.isCardType.value) {
    return false;
  }

  return Math.round(Math.abs(processedIndex.value - carousel.resolvedActiveIndex.value)) <= 1;
});
const animating = computed(() => {
  if (!carousel || carousel.dragging.value || carousel.loopTeleporting.value) {
    return false;
  }

  if (carousel.isCardType.value) {
    return true;
  }

  return active.value || index.value === carousel.previousIndex.value;
});
const boundaryTransitionActive = computed(
  () =>
    Boolean(
      carousel &&
      carousel.seamlessLoop.value &&
      carousel.loopTransitionDirection.value !== null &&
      !carousel.loopTeleporting.value
    )
);
const resolvedTransitionDuration = computed(() => {
  if (!carousel) {
    return "0ms";
  }

  if (carousel.loopTeleporting.value) {
    return "0ms";
  }

  return boundaryTransitionActive.value
    ? `${carousel.loopBoundaryDuration.value}ms`
    : `${carousel.duration.value}ms`;
});
const resolvedTransitionEasing = computed(() => {
  if (!carousel) {
    return "linear";
  }

  return boundaryTransitionActive.value
    ? carousel.loopBoundaryEasing.value
    : carousel.easing.value;
});
const translate = computed(() => {
  if (!carousel) {
    return 0;
  }

  if (carousel.isCardType.value) {
    const parentSize = carousel.viewportSize.value || 0;
    const delta = processedIndex.value - carousel.resolvedActiveIndex.value;

    if (inStage.value) {
      return (parentSize * ((2 - carousel.cardScale.value) * delta + 1)) / 4 + carousel.dragOffset.value;
    }

    if (processedIndex.value < carousel.resolvedActiveIndex.value) {
      return -(parentSize / 2 + 24) + carousel.dragOffset.value;
    }

    return parentSize + 24 + carousel.dragOffset.value;
  }

  if (carousel.isFadeEffect.value) {
    return 0;
  }

  const viewportSize = carousel.viewportSize.value || 0;
  const step = viewportSize > 0 ? (viewportSize - carousel.gapPx.value * (carousel.slidesPerView.value - 1)) / carousel.slidesPerView.value + carousel.gapPx.value : 0;
  const baseOffset = carousel.centered.value && viewportSize > 0
    ? (viewportSize - (viewportSize - carousel.gapPx.value * (carousel.slidesPerView.value - 1)) / carousel.slidesPerView.value) / 2
    : 0;
  const baseIndex = seamlessLoop.value ? carousel.visualIndex.value : carousel.resolvedActiveIndex.value;
  const logicalIndex = seamlessLoop.value
    ? resolveSeamlessTrackIndex(
        index.value,
        carousel.resolvedActiveIndex.value,
        carousel.items.value.length,
        carousel.loopTransitionDirection.value
      )
    : index.value;

  return baseOffset + (logicalIndex - baseIndex) * step + carousel.dragOffset.value;
});
const scale = computed(() => {
  if (!carousel?.isCardType.value) {
    return 1;
  }

  return active.value ? 1 : carousel.cardScale.value;
});
const shouldRender = computed(() => {
  if (!carousel || index.value < 0) {
    return true;
  }

  return carousel.renderIndices.value.has(index.value);
});

const itemClasses = computed(() => [
  `${ns.base.value}__item`,
  active.value ? "is-active" : "",
  inStage.value ? "is-in-stage" : "",
  animating.value ? "is-animating" : "",
  carousel?.dragging.value ? "is-dragging" : "",
  carousel?.isFadeEffect.value ? `${ns.base.value}__item--fade` : "",
  carousel?.isCardType.value ? `${ns.base.value}__item--card` : "",
  carousel?.isCardType.value && carousel?.isVertical.value ? `${ns.base.value}__item--card-vertical` : ""
]);

const itemStyle = computed<CSSProperties | undefined>(() => {
  if (!carousel || !ready.value) {
    return undefined;
  }

  const translateType = carousel.isVertical.value ? "translateY" : "translateX";

  if (carousel.isFadeEffect.value) {
    return {
      opacity: active.value ? 1 : 0,
      zIndex: active.value ? 2 : 1,
      pointerEvents: active.value ? "auto" : "none",
      transitionDuration: resolvedTransitionDuration.value,
      transitionTimingFunction: resolvedTransitionEasing.value
    };
  }

  if (carousel.isCardType.value) {
    return {
      transform: `${translateType}(${translate.value}px) scale(${scale.value})`,
      transitionDuration: resolvedTransitionDuration.value,
      transitionTimingFunction: resolvedTransitionEasing.value
    };
  }

  const viewportSize = carousel.viewportSize.value || 0;
  const leadingPeek = carousel.centered.value ? carousel.peekPx.value : 0;
  const trailingPeek = carousel.centered.value ? carousel.peekPx.value : carousel.peekPx.value;
  const availableSize =
    viewportSize > 0
      ? viewportSize - leadingPeek - trailingPeek - carousel.gapPx.value * (carousel.slidesPerView.value - 1)
      : 0;
  const mainSize = availableSize > 0 ? availableSize / carousel.slidesPerView.value : 0;

  return {
    transform: `${translateType}(${translate.value}px)`,
    transitionDuration: resolvedTransitionDuration.value,
    transitionTimingFunction: resolvedTransitionEasing.value,
    width: carousel.isVertical.value ? "100%" : `${mainSize}px`,
    height: carousel.isVertical.value ? `${mainSize}px` : "100%"
  };
});

function handleItemClick() {
  if (!carousel?.isCardType.value || active.value || index.value < 0) {
    return;
  }

  carousel.setActiveItem(index.value);
}

onMounted(() => {
  carousel?.registerItem({
    uid,
    props,
    getEl: () => itemRef.value
  });
});

onBeforeUnmount(() => {
  carousel?.unregisterItem(uid);
});
</script>

<template>
  <div ref="itemRef" v-show="ready" :class="itemClasses" :style="itemStyle" @click="handleItemClick">
    <div v-if="carousel?.isCardType.value && !active" class="xy-carousel__mask" />
    <slot v-if="shouldRender" />
  </div>
</template>
