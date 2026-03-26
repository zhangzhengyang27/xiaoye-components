import { computed, onBeforeUnmount, onMounted, ref, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";

function parseSize(value: string | number | undefined, viewport: number, fallback: number) {
  if (value == null || value === "") {
    return fallback;
  }

  if (typeof value === "number") {
    return value;
  }

  const normalized = value.trim();

  if (normalized.endsWith("%")) {
    const percent = Number.parseFloat(normalized.slice(0, -1));
    return Number.isNaN(percent) ? fallback : (viewport * percent) / 100;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useDialogResizable(
  panelRef: MaybeRefOrGetter<HTMLElement | null>,
  options: {
    width: MaybeRefOrGetter<string | number | undefined>;
    minWidth: MaybeRefOrGetter<string | number | undefined>;
    maxWidth: MaybeRefOrGetter<string | number | undefined>;
    minHeight: MaybeRefOrGetter<string | number | undefined>;
    maxHeight: MaybeRefOrGetter<string | number | undefined>;
    enabled: MaybeRefOrGetter<boolean>;
    fullscreen: MaybeRefOrGetter<boolean>;
    onResizeStart?: (event: MouseEvent, size: { width: number; height: number }) => void;
    onResize?: (event: MouseEvent, size: { width: number; height: number }) => void;
    onResizeEnd?: (event: MouseEvent, size: { width: number; height: number }) => void;
  }
) {
  const customWidth = ref<number | null>(null);
  const customHeight = ref<number | null>(null);
  const isResizing = ref(false);
  let startX = 0;
  let startY = 0;
  let startWidth = 0;
  let startHeight = 0;

  function getViewportWidth() {
    return typeof window === "undefined" ? 1024 : window.innerWidth;
  }

  function getViewportHeight() {
    return typeof window === "undefined" ? 768 : window.innerHeight;
  }

  function getBounds() {
    const panel = toValue(panelRef);
    const width = panel?.offsetWidth ?? parseSize(toValue(options.width), getViewportWidth(), 640);
    const height = panel?.offsetHeight ?? 240;

    return {
      width,
      height,
      minWidth: parseSize(toValue(options.minWidth), getViewportWidth(), 320),
      maxWidth: parseSize(toValue(options.maxWidth), getViewportWidth(), getViewportWidth() - 32),
      minHeight: parseSize(toValue(options.minHeight), getViewportHeight(), 160),
      maxHeight: parseSize(toValue(options.maxHeight), getViewportHeight(), getViewportHeight() - 32)
    };
  }

  function handlePointerMove(event: MouseEvent) {
    if (!isResizing.value) {
      return;
    }

    const bounds = getBounds();
    customWidth.value = clamp(startWidth + event.clientX - startX, bounds.minWidth, bounds.maxWidth);
    customHeight.value = clamp(startHeight + event.clientY - startY, bounds.minHeight, bounds.maxHeight);
    options.onResize?.(event, {
      width: customWidth.value,
      height: customHeight.value
    });
  }

  function stopResize(event?: MouseEvent) {
    if (!isResizing.value) {
      return;
    }

    isResizing.value = false;

    if (event && customWidth.value != null && customHeight.value != null) {
      options.onResizeEnd?.(event, {
        width: customWidth.value,
        height: customHeight.value
      });
    }
  }

  function handlePointerUp(event: MouseEvent) {
    stopResize(event);
  }

  function handleResizeStart(event: MouseEvent) {
    if (
      event.button !== 0 ||
      !toValue(options.enabled) ||
      toValue(options.fullscreen)
    ) {
      return;
    }

    const bounds = getBounds();
    startX = event.clientX;
    startY = event.clientY;
    startWidth = customWidth.value ?? bounds.width;
    startHeight = customHeight.value ?? bounds.height;
    isResizing.value = true;
    options.onResizeStart?.(event, {
      width: startWidth,
      height: startHeight
    });
    event.preventDefault();
  }

  watch(
    () => toValue(options.width),
    () => {
      customWidth.value = null;
    }
  );

  watch(
    () => toValue(options.fullscreen),
    (value) => {
      if (value) {
        stopResize();
      }
    }
  );

  watch(
    () => toValue(options.enabled),
    (value) => {
      if (value) {
        return;
      }

      stopResize();
    }
  );

  function resetSize() {
    customWidth.value = null;
    customHeight.value = null;
  }

  onMounted(() => {
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("mousemove", handlePointerMove);
    window.removeEventListener("mouseup", handlePointerUp);
  });

  return {
    customSizeStyle: computed(() => {
      if (toValue(options.fullscreen)) {
        return {};
      }

      const style: Record<string, string> = {};

      if (customWidth.value != null) {
        style.width = `${customWidth.value}px`;
      }

      if (customHeight.value != null) {
        style.height = `${customHeight.value}px`;
      }

      return style;
    }),
    handleResizeStart,
    isResizing,
    resetSize
  };
}
