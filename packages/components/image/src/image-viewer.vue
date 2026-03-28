<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { lockBodyScroll, unlockBodyScroll } from "@xiaoye/utils";
import {
  useFocusTrap,
  useNamespace,
  useOverlayStack
} from "@xiaoye/composables";
import XyIcon from "../../icon";
import type { ImageViewerAction } from "./image";

interface ImageViewerProps {
  modelValue?: boolean;
  urlList?: string[];
  initialIndex?: number;
  infinite?: boolean;
  hideOnClickModal?: boolean;
  teleported?: boolean;
  closeOnPressEscape?: boolean;
  zIndex?: number;
  zoomRate?: number;
  scale?: number;
  minScale?: number;
  maxScale?: number;
  showProgress?: boolean;
  crossorigin?: "anonymous" | "use-credentials" | "";
}

const props = withDefaults(defineProps<ImageViewerProps>(), {
  modelValue: false,
  urlList: () => [],
  initialIndex: 0,
  infinite: true,
  hideOnClickModal: false,
  teleported: false,
  closeOnPressEscape: true,
  zIndex: undefined,
  zoomRate: 1.2,
  scale: 1,
  minScale: 0.2,
  maxScale: 7,
  showProgress: false,
  crossorigin: ""
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
  switch: [index: number];
}>();
const slots = defineSlots<{
  progress?: (props: { activeIndex: number; total: number }) => unknown;
  toolbar?: (props: {
    actions: (action: ImageViewerAction) => void;
    prev: () => void;
    next: () => void;
    reset: () => void;
    activeIndex: number;
    setActiveItem: (index: number) => void;
  }) => unknown;
  "viewer-error"?: (props: { activeIndex: number; src: string; retry: () => void }) => unknown;
}>();

const ns = useNamespace("image-viewer");
const wrapperRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLElement | null>(null);
const viewerImageRef = ref<HTMLImageElement | null>(null);
const loadError = ref(false);
const loading = ref(true);
const imageRequestVersion = ref(0);
const { zIndex: overlayZIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();

const activeIndex = ref(0);
const isDragging = ref(false);
const mode = ref<"contain" | "original">("contain");
const transform = ref({
  scale: props.scale,
  deg: 0,
  offsetX: 0,
  offsetY: 0
});
const total = computed(() => props.urlList.length);
const isSingle = computed(() => total.value <= 1);
const isFirst = computed(() => activeIndex.value <= 0);
const isLast = computed(() => activeIndex.value >= total.value - 1);
const currentSrc = computed(() => props.urlList[activeIndex.value] ?? "");
const dialogLabel = computed(() =>
  total.value > 0 ? `图片预览，第 ${activeIndex.value + 1} 张，共 ${total.value} 张` : "图片预览"
);
const currentImageAlt = computed(() =>
  total.value > 0 ? `预览图片 ${activeIndex.value + 1} / ${total.value}` : "预览图片"
);
const viewerClasses = computed(() => [
  ns.base.value,
  mode.value === "original" ? "is-original" : ""
]);
const viewerImageKey = computed(() => `${currentSrc.value}-${imageRequestVersion.value}`);
const wrapperStyle = computed(() => ({
  zIndex: `${props.zIndex ?? overlayZIndex.value}`
}));
const hasProgress = computed(() => props.showProgress || Boolean(slots.progress));
const showToolbar = computed(() => !loading.value && !loadError.value);
const progressText = computed(() => `${activeIndex.value + 1} / ${total.value}`);
const canZoomOut = computed(() => transform.value.scale > props.minScale);
const canZoomIn = computed(() => transform.value.scale < props.maxScale);
const isMovable = computed(
  () => !loadError.value && (transform.value.scale > 1 || mode.value === "original")
);
const viewerImageClasses = computed(() => [
  "xy-image-viewer__image",
  loading.value ? "is-loading" : "",
  isMovable.value ? "is-draggable" : "",
  isDragging.value ? "is-dragging" : ""
]);
const imageStyle = computed(() => ({
  transform: `translate(${transform.value.offsetX}px, ${transform.value.offsetY}px) scale(${transform.value.scale}) rotate(${transform.value.deg}deg)`,
  maxWidth: mode.value === "contain" ? "100%" : "none",
  maxHeight: mode.value === "contain" ? "100%" : "none"
}));
let clearDragListeners: (() => void) | null = null;
let clearPinchListeners: (() => void) | null = null;

function clampScale(value: number) {
  return Math.min(props.maxScale, Math.max(props.minScale, value));
}

function clampOffsets(nextScale: number, nextOffsetX: number, nextOffsetY: number) {
  const canvas = canvasRef.value;
  const image = viewerImageRef.value;

  if (!canvas || !image) {
    return {
      offsetX: nextOffsetX,
      offsetY: nextOffsetY
    };
  }

  const canvasWidth = canvas.clientWidth;
  const canvasHeight = canvas.clientHeight;
  const imageWidth = image.offsetWidth;
  const imageHeight = image.offsetHeight;

  if (!canvasWidth || !canvasHeight || !imageWidth || !imageHeight) {
    return {
      offsetX: nextOffsetX,
      offsetY: nextOffsetY
    };
  }

  const maxOffsetX = Math.max((imageWidth * nextScale - canvasWidth) / 2, 0);
  const maxOffsetY = Math.max((imageHeight * nextScale - canvasHeight) / 2, 0);

  return {
    offsetX: Math.min(maxOffsetX, Math.max(-maxOffsetX, nextOffsetX)),
    offsetY: Math.min(maxOffsetY, Math.max(-maxOffsetY, nextOffsetY))
  };
}

function resetTransform() {
  stopInteraction();
  transform.value = {
    scale: clampScale(props.scale),
    deg: 0,
    offsetX: 0,
    offsetY: 0
  };
  mode.value = "contain";
}

function normalizeIndex(index: number) {
  if (total.value <= 0) {
    return 0;
  }

  if (props.infinite) {
    return (index + total.value) % total.value;
  }

  return Math.min(Math.max(index, 0), total.value - 1);
}

function setActiveIndex(index: number) {
  const nextIndex = normalizeIndex(index);

  if (nextIndex === activeIndex.value) {
    return;
  }

  activeIndex.value = nextIndex;
  imageRequestVersion.value += 1;
  loading.value = true;
  loadError.value = false;
  resetTransform();
  emit("switch", nextIndex);
}

function openViewer() {
  activeIndex.value = normalizeIndex(props.initialIndex);
  imageRequestVersion.value += 1;
  loading.value = true;
  loadError.value = false;
  resetTransform();
  openLayer();
  lockBodyScroll();
}

function closeViewer() {
  stopInteraction();
  closeLayer();
  unlockBodyScroll();
  emit("update:modelValue", false);
  emit("close");
}

function handleMaskClick() {
  if (!props.hideOnClickModal) {
    return;
  }

  closeViewer();
}

function handlePrev() {
  if (!props.infinite && isFirst.value) {
    return;
  }

  setActiveIndex(activeIndex.value - 1);
}

function handleNext() {
  if (!props.infinite && isLast.value) {
    return;
  }

  setActiveIndex(activeIndex.value + 1);
}

function handleImageError() {
  loading.value = false;
  loadError.value = true;
}

function handleImageLoad() {
  loading.value = false;
  loadError.value = false;
}

function retryLoad() {
  imageRequestVersion.value += 1;
  loading.value = true;
  loadError.value = false;
  stopInteraction();

  nextTick(() => {
    if (viewerImageRef.value?.complete) {
      loading.value = false;
    }
  });
}

function stopDragging() {
  isDragging.value = false;
  clearDragListeners?.();
  clearDragListeners = null;
}

function stopPinching() {
  clearPinchListeners?.();
  clearPinchListeners = null;
}

function stopInteraction() {
  stopDragging();
  stopPinching();
}

function startDragging(startX: number, startY: number) {
  if (!isMovable.value) {
    return;
  }

  stopDragging();

  const initialOffsetX = transform.value.offsetX;
  const initialOffsetY = transform.value.offsetY;
  isDragging.value = true;

  const updateOffset = (pageX: number, pageY: number) => {
    const nextOffsets = clampOffsets(
      transform.value.scale,
      initialOffsetX + pageX - startX,
      initialOffsetY + pageY - startY
    );

    transform.value = {
      ...transform.value,
      offsetX: nextOffsets.offsetX,
      offsetY: nextOffsets.offsetY
    };
  };

  const handleMouseMove = (event: MouseEvent) => {
    updateOffset(event.clientX, event.clientY);
  };

  const handleMouseUp = () => {
    stopDragging();
  };

  const handleTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    event.preventDefault();
    updateOffset(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    stopDragging();
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("touchmove", handleTouchMove, {
    passive: false
  });
  document.addEventListener("touchend", handleTouchEnd);
  document.addEventListener("touchcancel", handleTouchEnd);

  clearDragListeners = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    document.removeEventListener("touchcancel", handleTouchEnd);
  };
}

function getTouchDistance(touches: TouchList | ArrayLike<{ clientX: number; clientY: number }>) {
  const first = touches[0];
  const second = touches[1];

  if (!first || !second) {
    return 0;
  }

  const deltaX = second.clientX - first.clientX;
  const deltaY = second.clientY - first.clientY;
  return Math.hypot(deltaX, deltaY);
}

function getTouchCenter(touches: TouchList | ArrayLike<{ clientX: number; clientY: number }>) {
  const first = touches[0];
  const second = touches[1];

  if (!first || !second) {
    return {
      x: 0,
      y: 0
    };
  }

  return {
    x: (first.clientX + second.clientX) / 2,
    y: (first.clientY + second.clientY) / 2
  };
}

function startPinchGesture(touches: TouchList) {
  stopInteraction();

  const initialDistance = getTouchDistance(touches);
  const initialCenter = getTouchCenter(touches);
  const initialScale = transform.value.scale;
  const initialOffsetX = transform.value.offsetX;
  const initialOffsetY = transform.value.offsetY;

  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length < 2) {
      return;
    }

    event.preventDefault();

    const nextDistance = getTouchDistance(event.touches);
    const nextCenter = getTouchCenter(event.touches);
    const nextScale = clampScale(
      initialDistance > 0 ? (initialScale * nextDistance) / initialDistance : initialScale
    );
    const nextOffsets = clampOffsets(
      nextScale,
      initialOffsetX + nextCenter.x - initialCenter.x,
      initialOffsetY + nextCenter.y - initialCenter.y
    );

    transform.value = {
      ...transform.value,
      scale: nextScale,
      offsetX: nextOffsets.offsetX,
      offsetY: nextOffsets.offsetY
    };
  };

  const handleTouchEnd = () => {
    stopPinching();
  };

  document.addEventListener("touchmove", handleTouchMove, {
    passive: false
  });
  document.addEventListener("touchend", handleTouchEnd);
  document.addEventListener("touchcancel", handleTouchEnd);

  clearPinchListeners = () => {
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    document.removeEventListener("touchcancel", handleTouchEnd);
  };
}

function handleMouseDown(event: MouseEvent) {
  if (event.button !== 0) {
    return;
  }

  event.preventDefault();
  startDragging(event.clientX, event.clientY);
}

function handleTouchStart(event: TouchEvent) {
  if (event.touches.length >= 2) {
    event.preventDefault();
    startPinchGesture(event.touches);
    return;
  }

  const touch = event.touches[0];

  if (!touch) {
    return;
  }

  event.preventDefault();
  startDragging(touch.clientX, touch.clientY);
}

function handleDoubleClick() {
  if (loading.value || loadError.value) {
    return;
  }

  const baseScale = clampScale(props.scale);

  if (
    transform.value.scale !== baseScale ||
    transform.value.deg !== 0 ||
    transform.value.offsetX !== 0 ||
    transform.value.offsetY !== 0 ||
    mode.value !== "contain"
  ) {
    resetTransform();
    return;
  }

  transform.value = {
    ...transform.value,
    scale: clampScale(Math.max(baseScale * props.zoomRate, 2))
  };
}

function handleActions(action: ImageViewerAction) {
  if (loading.value || loadError.value) {
    return;
  }

  switch (action) {
    case "zoomIn":
      {
        const nextScale = clampScale(transform.value.scale * props.zoomRate);
        const nextOffsets = clampOffsets(
          nextScale,
          transform.value.offsetX,
          transform.value.offsetY
        );

        transform.value = {
          ...transform.value,
          scale: nextScale,
          offsetX: nextOffsets.offsetX,
          offsetY: nextOffsets.offsetY
        };
      }
      break;
    case "zoomOut":
      transform.value = {
        ...transform.value,
        ...clampOffsets(
          clampScale(transform.value.scale / props.zoomRate),
          transform.value.offsetX,
          transform.value.offsetY
        ),
        scale: clampScale(transform.value.scale / props.zoomRate)
      };
      break;
    case "clockwise":
      transform.value = {
        ...transform.value,
        deg: transform.value.deg + 90
      };
      break;
    case "anticlockwise":
      transform.value = {
        ...transform.value,
        deg: transform.value.deg - 90
      };
      break;
    case "toggleMode":
      mode.value = mode.value === "contain" ? "original" : "contain";
      {
        const nextOffsets = clampOffsets(
          transform.value.scale,
          transform.value.offsetX,
          transform.value.offsetY
        );

        transform.value = {
          ...transform.value,
          offsetX: nextOffsets.offsetX,
          offsetY: nextOffsets.offsetY
        };
      }
      break;
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.modelValue || !isTopMost.value) {
    return;
  }

  switch (event.key) {
    case "Escape":
      if (props.closeOnPressEscape) {
        event.preventDefault();
        event.stopPropagation();
        closeViewer();
      }
      break;
    case "ArrowLeft":
      event.preventDefault();
      handlePrev();
      break;
    case "ArrowRight":
      event.preventDefault();
      handleNext();
      break;
    case "ArrowUp":
      event.preventDefault();
      handleActions("zoomIn");
      break;
    case "ArrowDown":
      event.preventDefault();
      handleActions("zoomOut");
      break;
    case " ":
    case "Spacebar":
      event.preventDefault();
      handleActions("toggleMode");
      break;
  }
}

function handleWheel(event: WheelEvent) {
  if (!props.modelValue || !isTopMost.value) {
    return;
  }

  event.preventDefault();
  handleActions(event.deltaY < 0 ? "zoomIn" : "zoomOut");
}

watch(
  () => props.modelValue,
  async (value) => {
    if (value) {
      openViewer();
      await nextTick();
      if (viewerImageRef.value?.complete) {
        loading.value = false;
      }
      wrapperRef.value?.focus();
      return;
    }

    closeLayer();
    unlockBodyScroll();
  },
  {
    immediate: true
  }
);

watch(
  () => [props.initialIndex, props.urlList],
  () => {
    if (!props.modelValue) {
      return;
    }

    activeIndex.value = normalizeIndex(props.initialIndex);
    loading.value = true;
    loadError.value = false;
    resetTransform();
  }
);

const focusTrap = useFocusTrap(wrapperRef, {
  active: () => props.modelValue,
  autoFocus: "container",
  restoreFocus: true
});

onBeforeUnmount(() => {
  stopInteraction();
  unlockBodyScroll();
  closeLayer();
});
</script>

<template>
  <teleport to="body" :disabled="!props.teleported">
    <transition name="xy-fade">
      <div
        v-if="props.modelValue"
        ref="wrapperRef"
        :class="viewerClasses"
        :style="wrapperStyle"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        :aria-label="dialogLabel"
        aria-describedby="xy-image-viewer-instructions"
        @keydown.capture="focusTrap.handleKeydown"
        @keydown="handleKeydown"
        @wheel.prevent="handleWheel"
      >
        <p id="xy-image-viewer-instructions" class="xy-sr-only">
          使用左右方向键切换图片，上下方向键缩放，空格切换显示模式，Escape 关闭预览。双击可以快速放大或重置，放大后支持拖拽平移。
        </p>
        <div class="xy-image-viewer__mask" @click="handleMaskClick" />

        <button
          type="button"
          class="xy-image-viewer__close"
          aria-label="关闭图片预览"
          @click="closeViewer"
        >
          <XyIcon icon="mdi:close" :size="20" />
        </button>

        <button
          v-if="!isSingle"
          type="button"
          class="xy-image-viewer__arrow xy-image-viewer__arrow--prev"
          :disabled="!props.infinite && isFirst"
          aria-label="上一张"
          @click="handlePrev"
        >
          <XyIcon icon="mdi:chevron-left" :size="22" />
        </button>

        <button
          v-if="!isSingle"
          type="button"
          class="xy-image-viewer__arrow xy-image-viewer__arrow--next"
          :disabled="!props.infinite && isLast"
          aria-label="下一张"
          @click="handleNext"
        >
          <XyIcon icon="mdi:chevron-right" :size="22" />
        </button>

        <div
          v-if="hasProgress"
          :class="[
            'xy-image-viewer__progress',
            !showToolbar ? 'is-floating' : ''
          ]"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <slot name="progress" :active-index="activeIndex" :total="total">
            <div class="xy-image-viewer__progress-inner">
              <span class="xy-image-viewer__progress-kicker">Preview</span>
              <span class="xy-image-viewer__progress-divider" />
              <strong class="xy-image-viewer__progress-value">{{ progressText }}</strong>
            </div>
          </slot>
        </div>

        <div
          ref="canvasRef"
          class="xy-image-viewer__canvas"
          :aria-busy="loading ? 'true' : 'false'"
        >
          <div
            v-if="loading && !loadError"
            class="xy-image-viewer__loading"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            图片加载中...
          </div>
          <span v-if="loadError" class="xy-sr-only" role="alert">图片加载失败</span>
          <slot
            v-if="loadError"
            name="viewer-error"
            :active-index="activeIndex"
            :src="currentSrc"
            :retry="retryLoad"
          >
            <div class="xy-image-viewer__error" role="alert">
              <span>图片加载失败</span>
              <button
                type="button"
                class="xy-image-viewer__retry"
                aria-label="重试加载图片"
                @click="retryLoad"
              >
                重新加载
              </button>
            </div>
          </slot>
          <img
            v-else
            ref="viewerImageRef"
            :key="viewerImageKey"
            :class="viewerImageClasses"
            :src="currentSrc"
            :style="imageStyle"
            :alt="currentImageAlt"
            :crossorigin="props.crossorigin || undefined"
            @dragstart.prevent
            @dblclick="handleDoubleClick"
            @mousedown="handleMouseDown"
            @touchstart="handleTouchStart"
            @load="handleImageLoad"
            @error="handleImageError"
          />
        </div>

        <div
          :class="[
            'xy-image-viewer__actions',
            !showToolbar ? 'is-hidden' : ''
          ]"
        >
          <slot
            name="toolbar"
            :actions="handleActions"
            :prev="handlePrev"
            :next="handleNext"
            :reset="resetTransform"
            :active-index="activeIndex"
            :set-active-item="setActiveIndex"
          >
            <button
              type="button"
              class="xy-image-viewer__action"
              :disabled="!canZoomOut"
              aria-label="缩小"
              @click="handleActions('zoomOut')"
            >
              <XyIcon icon="mdi:magnify-minus-outline" :size="20" />
            </button>
            <button
              type="button"
              class="xy-image-viewer__action"
              :disabled="!canZoomIn"
              aria-label="放大"
              @click="handleActions('zoomIn')"
            >
              <XyIcon icon="mdi:magnify-plus-outline" :size="20" />
            </button>
            <span class="xy-image-viewer__action-divider" />
            <button
              type="button"
              class="xy-image-viewer__action"
              aria-label="逆时针旋转"
              @click="handleActions('anticlockwise')"
            >
              <XyIcon icon="mdi:rotate-left" :size="20" />
            </button>
            <button
              type="button"
              class="xy-image-viewer__action"
              aria-label="顺时针旋转"
              @click="handleActions('clockwise')"
            >
              <XyIcon icon="mdi:rotate-right" :size="20" />
            </button>
            <span class="xy-image-viewer__action-divider" />
            <button
              type="button"
              class="xy-image-viewer__action xy-image-viewer__action--accent"
              aria-label="重置视图"
              @click="resetTransform"
            >
              <XyIcon icon="mdi:restore" :size="20" />
            </button>
          </slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>
