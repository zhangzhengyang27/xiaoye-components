<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});

import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue";
import type { CSSProperties } from "vue";
import { useNamespace } from "@xiaoye/composables";
import ImageViewer from "./image-viewer.vue";
import type { ImageProps, ImageViewerAction } from "./image";

const props = withDefaults(defineProps<ImageProps>(), {
  src: "",
  alt: "",
  fit: "cover",
  loading: undefined,
  lazy: false,
  scrollContainer: undefined,
  previewSrcList: () => [],
  previewTeleported: false,
  zIndex: undefined,
  initialIndex: 0,
  infinite: true,
  hideOnClickModal: false,
  closeOnPressEscape: true,
  zoomRate: 1.2,
  scale: 1,
  minScale: 0.2,
  maxScale: 7,
  showProgress: false,
  crossorigin: ""
});

const emit = defineEmits<{
  load: [event: Event];
  error: [event: Event];
  close: [];
  show: [];
  switch: [index: number];
}>();

const slots = defineSlots<{
  placeholder?: () => unknown;
  error?: () => unknown;
  "viewer-error"?: (props: { activeIndex: number; src: string; retry: () => void }) => unknown;
  progress?: (props: { activeIndex: number; total: number }) => unknown;
  toolbar?: (props: {
    actions: (action: ImageViewerAction) => void;
    prev: () => void;
    next: () => void;
    reset: () => void;
    activeIndex: number;
    setActiveItem: (index: number) => void;
  }) => unknown;
}>();

const attrs = useAttrs();
const ns = useNamespace("image");
const containerRef = ref<HTMLElement | null>(null);
const imageSrc = ref("");
const isLoading = ref(false);
const hasLoadError = ref(false);
const showViewer = ref(false);
const observer = ref<IntersectionObserver | null>(null);

const previewEnabled = computed(
  () => Array.isArray(props.previewSrcList) && props.previewSrcList.length > 0
);

const containerAttrs = computed(() => {
  const result: Record<string, unknown> = {};

  Object.entries(attrs).forEach(([key, value]) => {
    if (
      key === "style" ||
      key === "id" ||
      key === "role" ||
      key.startsWith("data-") ||
      key.startsWith("aria-")
    ) {
      result[key] = value;
    }
  });

  return result;
});

const imgAttrs = computed(() => {
  const result: Record<string, unknown> = {};

  Object.entries(attrs).forEach(([key, value]) => {
    if (key !== "class" && !(key in containerAttrs.value)) {
      result[key] = value;
    }
  });

  return result;
});

const imageClasses = computed(() => [
  `${ns.base.value}__inner`,
  previewEnabled.value ? `${ns.base.value}__preview` : "",
  isLoading.value ? "is-loading" : ""
]);

const imageStyle = computed<CSSProperties>(() => ({
  objectFit: props.fit
}));

const isManualLazy = computed(() => {
  if (props.loading === "eager") {
    return false;
  }

  return props.lazy;
});

function resetState() {
  hasLoadError.value = false;
  isLoading.value = Boolean(props.src);
}

function resolveScrollRoot() {
  if (typeof window === "undefined") {
    return null;
  }

  const { scrollContainer } = props;

  if (typeof HTMLElement !== "undefined" && scrollContainer instanceof HTMLElement) {
    return scrollContainer;
  }

  if (typeof scrollContainer === "string" && scrollContainer) {
    return document.querySelector(scrollContainer);
  }

  return null;
}

function disconnectObserver() {
  observer.value?.disconnect();
  observer.value = null;
}

function loadImage() {
  resetState();
  imageSrc.value = props.src;
}

function handleLoad(event: Event) {
  isLoading.value = false;
  hasLoadError.value = false;
  emit("load", event);
}

function handleError(event: Event) {
  isLoading.value = false;
  hasLoadError.value = true;
  emit("error", event);
}

function setupLazyObserver() {
  if (typeof window === "undefined") {
    loadImage();
    return;
  }

  disconnectObserver();
  resetState();
  imageSrc.value = "";

  if (!props.src) {
    isLoading.value = false;
    return;
  }

  if (!("IntersectionObserver" in window)) {
    loadImage();
    return;
  }

  observer.value = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      loadImage();
      disconnectObserver();
    },
    {
      root: resolveScrollRoot()
    }
  );

  if (containerRef.value) {
    observer.value.observe(containerRef.value);
  }
}

function openPreview() {
  if (!previewEnabled.value) {
    return;
  }

  showViewer.value = true;
  emit("show");
}

function closePreview() {
  showViewer.value = false;
  emit("close");
}

function handleSwitch(index: number) {
  emit("switch", index);
}

watch(
  () => [props.src, props.lazy, props.loading, props.scrollContainer],
  () => {
    if (isManualLazy.value) {
      resetState();
      imageSrc.value = "";

      if (containerRef.value) {
        setupLazyObserver();
      }

      return;
    }

    loadImage();
  },
  {
    immediate: true
  }
);

onMounted(() => {
  if (isManualLazy.value && !observer.value) {
    setupLazyObserver();
  }
});

onBeforeUnmount(() => {
  disconnectObserver();
});

defineExpose({
  showPreview: openPreview,
  closePreview: closePreview
});
</script>

<template>
  <div ref="containerRef" v-bind="containerAttrs" :class="[ns.base.value, attrs.class]">
    <slot v-if="hasLoadError" name="error">
      <div class="xy-image__error">图片加载失败</div>
    </slot>
    <template v-else>
      <img
        v-if="imageSrc"
        v-bind="imgAttrs"
        :src="imageSrc"
        :alt="props.alt"
        :loading="props.loading"
        :class="imageClasses"
        :style="imageStyle"
        :crossorigin="props.crossorigin || undefined"
        @click="openPreview"
        @load="handleLoad"
        @error="handleError"
      />

      <div v-if="isLoading" class="xy-image__wrapper">
        <slot name="placeholder">
          <div class="xy-image__placeholder" />
        </slot>
      </div>
    </template>

    <ImageViewer
      v-if="previewEnabled"
      v-model="showViewer"
      :url-list="props.previewSrcList"
      :initial-index="props.initialIndex"
      :infinite="props.infinite"
      :hide-on-click-modal="props.hideOnClickModal"
      :teleported="props.previewTeleported"
      :close-on-press-escape="props.closeOnPressEscape"
      :zoom-rate="props.zoomRate"
      :scale="props.scale"
      :min-scale="props.minScale"
      :max-scale="props.maxScale"
      :z-index="props.zIndex"
      :show-progress="props.showProgress"
      :crossorigin="props.crossorigin"
      @close="closePreview"
      @switch="handleSwitch"
    >
      <template v-if="slots['viewer-error']" #viewer-error="slotProps">
        <slot name="viewer-error" v-bind="slotProps" />
      </template>
      <template v-if="slots.progress" #progress="slotProps">
        <slot name="progress" v-bind="slotProps" />
      </template>
      <template v-if="slots.toolbar" #toolbar="slotProps">
        <slot name="toolbar" v-bind="slotProps" />
      </template>
    </ImageViewer>
  </div>
</template>
