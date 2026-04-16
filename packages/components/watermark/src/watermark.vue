<script setup lang="ts">
defineOptions({
  name: "XyWatermark",
  inheritAttrs: false
});

import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useAttrs, watch } from "vue";
import type { CSSProperties, StyleValue } from "vue";
import { useNamespace } from "@xiaoye/composables";
import useClips from "./use-clips";
import {
  getPixelRatio,
  getStyleStr,
  hasWatermarkContent,
  normalizeFontSize,
  normalizeFontStyle,
  reRendering
} from "./utils";
import type {
  WatermarkProps,
  WatermarkRenderPayload,
  WatermarkRenderSource
} from "./watermark";

const props = withDefaults(defineProps<WatermarkProps>(), {
  zIndex: 9,
  rotate: -22,
  content: "Xiaoye Components",
  gap: () => [100, 100],
  disabled: false,
  opacity: 1,
  repeat: "repeat",
  autoObserve: true,
  fullscreen: false,
  target: undefined
});

const emit = defineEmits<{
  rendered: [payload: WatermarkRenderPayload];
  "image-error": [event: Event];
}>();

const attrs = useAttrs();
const ns = useNamespace("watermark");
const getClips = useClips();

const wrapperRef = shallowRef<HTMLDivElement | null>(null);
const hostRef = shallowRef<HTMLElement | null>(null);
const watermarkRef = shallowRef<HTMLDivElement>();
const observerRef = shallowRef<MutationObserver | null>(null);
const patchedHostRef = shallowRef<HTMLElement | null>(null);
const stopObservation = ref(false);
const lastDataUrl = ref<string | null>(null);

let observationTimer: ReturnType<typeof setTimeout> | null = null;
let renderToken = 0;

const containerClass = computed(() => [ns.base.value, attrs.class]);
const containerStyle = computed<StyleValue>(() => [
  {
    position: "relative"
  },
  attrs.style as StyleValue
]);

const passthroughAttrs = computed(() => {
  const result: Record<string, unknown> = {};

  Object.entries(attrs).forEach(([key, value]) => {
    if (
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

const fontGap = computed(() => props.font?.fontGap ?? 3);
const color = computed(() => props.font?.color ?? "rgba(0,0,0,.15)");
const fontSize = computed(() => props.font?.fontSize ?? 16);
const numericFontSize = computed(() => normalizeFontSize(fontSize.value, 16));
const fontWeight = computed(() => props.font?.fontWeight ?? "normal");
const fontStyle = computed(() => props.font?.fontStyle ?? "normal");
const fontFamily = computed(() => props.font?.fontFamily ?? "sans-serif");
const textAlign = computed(() => props.font?.textAlign ?? "center");
const textBaseline = computed(() => props.font?.textBaseline ?? "hanging");
const normalizedOpacity = computed(() => {
  const nextOpacity = props.opacity ?? 1;

  if (!Number.isFinite(nextOpacity)) {
    return 1;
  }

  return Math.min(1, Math.max(0, nextOpacity));
});

const gapX = computed(() => props.gap[0]);
const gapY = computed(() => props.gap[1]);
const gapXCenter = computed(() => gapX.value / 2);
const gapYCenter = computed(() => gapY.value / 2);
const offsetLeft = computed(() => props.offset?.[0] ?? gapXCenter.value);
const offsetTop = computed(() => props.offset?.[1] ?? gapYCenter.value);

function pauseObservation() {
  stopObservation.value = true;

  if (observationTimer) {
    clearTimeout(observationTimer);
  }

  observationTimer = setTimeout(() => {
    stopObservation.value = false;
    observationTimer = null;
  }, 0);
}

function disconnectObserver() {
  observerRef.value?.disconnect();
  observerRef.value = null;
}

function destroyWatermark() {
  if (!watermarkRef.value) {
    return;
  }

  pauseObservation();
  watermarkRef.value.remove();
  watermarkRef.value = undefined;
}

function clearRenderedState() {
  lastDataUrl.value = null;
}

function isElementTarget(value: unknown): value is HTMLElement {
  return typeof HTMLElement !== "undefined" && value instanceof HTMLElement;
}

function cleanupPatchedHost() {
  patchedHostRef.value?.classList.remove("xy-watermark-target--relative");
  patchedHostRef.value = null;
}

function resolveHostElement() {
  if (typeof window === "undefined") {
    return wrapperRef.value;
  }

  if (props.fullscreen) {
    return document.body;
  }

  if (isElementTarget(props.target)) {
    return props.target;
  }

  if (typeof props.target === "string" && props.target) {
    const resolvedTarget = document.querySelector<HTMLElement>(props.target);

    if (!resolvedTarget) {
      throw new Error(`[XyWatermark] target does not exist: ${props.target}`);
    }

    return resolvedTarget;
  }

  return wrapperRef.value;
}

function syncHostTarget() {
  cleanupPatchedHost();
  hostRef.value = resolveHostElement();

  if (
    props.fullscreen ||
    !hostRef.value ||
    hostRef.value === wrapperRef.value ||
    typeof window === "undefined"
  ) {
    return;
  }

  const hostPosition = window.getComputedStyle(hostRef.value).position;

  if (!hostPosition || hostPosition === "static") {
    hostRef.value.classList.add("xy-watermark-target--relative");
    patchedHostRef.value = hostRef.value;
  }
}

function getMarkStyle() {
  const markStyle: CSSProperties = {
    zIndex: props.zIndex,
    position: props.fullscreen ? "fixed" : "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    backgroundRepeat: props.repeat,
    opacity: normalizedOpacity.value
  };

  let positionLeft = offsetLeft.value - gapXCenter.value;
  let positionTop = offsetTop.value - gapYCenter.value;

  if (positionLeft > 0) {
    markStyle.left = `${positionLeft}px`;
    markStyle.width = `calc(100% - ${positionLeft}px)`;
    positionLeft = 0;
  }

  if (positionTop > 0) {
    markStyle.top = `${positionTop}px`;
    markStyle.height = `calc(100% - ${positionTop}px)`;
    positionTop = 0;
  }

  markStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`;

  return markStyle;
}

function appendWatermark(
  base64Url: string,
  markWidth: number,
  markHeight: number,
  source: WatermarkRenderSource
) {
  if (!hostRef.value) {
    return;
  }

  if (!watermarkRef.value) {
    watermarkRef.value = document.createElement("div");
    watermarkRef.value.className = `${ns.base.value}__layer`;
    watermarkRef.value.setAttribute("aria-hidden", "true");
  }

  pauseObservation();
  watermarkRef.value.setAttribute(
    "style",
    getStyleStr({
      ...getMarkStyle(),
      backgroundImage: `url('${base64Url}')`,
      backgroundSize: `${Math.floor(markWidth)}px ${Math.floor(markHeight)}px`
    })
  );

  if (!hostRef.value.contains(watermarkRef.value)) {
    hostRef.value.append(watermarkRef.value);
  }

  lastDataUrl.value = base64Url;
  emit("rendered", {
    dataUrl: base64Url,
    width: markWidth,
    height: markHeight,
    source,
    target: hostRef.value
  });
}

function getContentLines() {
  if (Array.isArray(props.content)) {
    return props.content.filter((item) => String(item ?? "").trim().length > 0);
  }

  return String(props.content ?? "").trim().length > 0 ? [String(props.content)] : [];
}

function getMarkSize(ctx: CanvasRenderingContext2D) {
  let defaultWidth = 120;
  let defaultHeight = 64;
  let space = 0;

  const { image, width, height, rotate } = props;

  if (!image && ctx.measureText) {
    ctx.font = `${normalizeFontStyle(fontStyle.value)} normal ${fontWeight.value} ${numericFontSize.value}px/${numericFontSize.value}px ${fontFamily.value}`;

    const contents = getContentLines();
    let maxWidth = 0;
    let maxHeight = 0;

    contents.forEach((item) => {
      const {
        width: measuredWidth,
        fontBoundingBoxAscent,
        fontBoundingBoxDescent,
        actualBoundingBoxAscent,
        actualBoundingBoxDescent
      } = ctx.measureText(item);
      const measuredHeight =
        fontBoundingBoxAscent === undefined || fontBoundingBoxDescent === undefined
          ? actualBoundingBoxAscent + actualBoundingBoxDescent || numericFontSize.value
          : fontBoundingBoxAscent + fontBoundingBoxDescent;

      if (measuredWidth > maxWidth) {
        maxWidth = Math.ceil(measuredWidth);
      }

      if (measuredHeight > maxHeight) {
        maxHeight = Math.ceil(measuredHeight);
      }
    });

    if (contents.length > 0) {
      defaultWidth = maxWidth;
      defaultHeight = maxHeight * contents.length + (contents.length - 1) * fontGap.value;

      const angle = (Math.PI / 180) * Number(rotate);
      space = Math.ceil(Math.abs(Math.sin(angle) * defaultHeight) / 2);
      defaultWidth += space;
    }
  }

  return [width ?? defaultWidth, height ?? defaultHeight, space] as const;
}

function renderWatermark() {
  renderToken += 1;
  const token = renderToken;

  if (!hostRef.value) {
    return;
  }

  if (props.disabled || !hasWatermarkContent(props.image, props.content)) {
    destroyWatermark();
    clearRenderedState();
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  const ratio = getPixelRatio();
  const [markWidth, markHeight, space] = getMarkSize(ctx);

  const drawCanvas = (
    drawContent: NonNullable<WatermarkProps["content"]> | HTMLImageElement,
    source: WatermarkRenderSource
  ) => {
    if (token !== renderToken) {
      return;
    }

    const [textClips, clipWidth, clipHeight] = getClips(
      drawContent ?? "",
      props.rotate,
      ratio,
      markWidth,
      markHeight,
      {
        color: color.value,
        fontSize: fontSize.value,
        fontStyle: fontStyle.value,
        fontWeight: fontWeight.value,
        fontFamily: fontFamily.value,
        fontGap: fontGap.value,
        textAlign: textAlign.value,
        textBaseline: textBaseline.value
      },
      gapX.value,
      gapY.value,
      space
    );

    appendWatermark(textClips, clipWidth, clipHeight, source);
  };

  destroyWatermark();

  if (props.image) {
    const image = new Image();

    image.onload = () => {
      drawCanvas(image as unknown as HTMLImageElement, "image");
    };
    image.onerror = (event) => {
      emit("image-error", event instanceof Event ? event : new Event("error"));

      if (!hasWatermarkContent(undefined, props.content)) {
        destroyWatermark();
        clearRenderedState();
        return;
      }

      drawCanvas(props.content ?? "", "text");
    };

    if ("crossOrigin" in image) {
      (image as HTMLImageElement).crossOrigin = "anonymous";
    }

    if ("referrerPolicy" in image) {
      (image as HTMLImageElement).referrerPolicy = "no-referrer";
    }

    image.src = props.image;

    return;
  }

  drawCanvas(props.content ?? "", "text");
}

function connectObserver() {
  disconnectObserver();

  if (typeof MutationObserver === "undefined" || !hostRef.value || !props.autoObserve) {
    return;
  }

  const observedHost = hostRef.value;

  observerRef.value = new MutationObserver((mutations) => {
    if (stopObservation.value) {
      return;
    }

    mutations.forEach((mutation) => {
      if (reRendering(mutation, watermarkRef.value)) {
        destroyWatermark();
        renderWatermark();
      }
    });
  });

  observerRef.value.observe(observedHost, {
    attributes: true,
    subtree: true,
    childList: true
  });
}

function refreshHostAndWatermark() {
  disconnectObserver();
  destroyWatermark();
  syncHostTarget();
  renderWatermark();
  connectObserver();
}

function rerender() {
  renderWatermark();
}

function getDataUrl() {
  return lastDataUrl.value;
}

function getTarget() {
  return hostRef.value;
}

function removeWatermark() {
  destroyWatermark();
}

onMounted(() => {
  refreshHostAndWatermark();
});

watch(
  () => [props.target, props.fullscreen, props.autoObserve],
  () => {
    refreshHostAndWatermark();
  },
  {
    deep: true,
    flush: "post"
  }
);

watch(
  () => [
    props.disabled,
    props.opacity,
    props.repeat,
    props.zIndex,
    props.rotate,
    props.width,
    props.height,
    props.image,
    props.content,
    props.font,
    props.gap,
    props.offset
  ],
  () => {
    renderWatermark();
  },
  {
    deep: true,
    flush: "post"
  }
);

onBeforeUnmount(() => {
  disconnectObserver();
  cleanupPatchedHost();

  if (observationTimer) {
    clearTimeout(observationTimer);
    observationTimer = null;
  }

  watermarkRef.value?.remove();
  watermarkRef.value = undefined;
  clearRenderedState();
  hostRef.value = null;
});

defineExpose({
  rerender,
  getDataUrl,
  getTarget,
  removeWatermark
});
</script>

<template>
  <div
    ref="wrapperRef"
    :class="containerClass"
    :style="containerStyle"
    v-bind="passthroughAttrs"
  >
    <slot />
  </div>
</template>
