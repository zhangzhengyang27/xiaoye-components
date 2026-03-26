import { computed, onBeforeUnmount, ref, toValue, watch } from "vue";
import type { MaybeRefOrGetter, Ref } from "vue";
import type { DrawerDirection } from "./drawer";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function addUnit(value: string | number | undefined) {
  if (value == null || value === "") {
    return "";
  }

  if (typeof value === "number") {
    return `${value}px`;
  }

  return /^-?\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

export function useResizable(
  panelRef: Ref<HTMLElement | null>,
  direction: MaybeRefOrGetter<DrawerDirection>,
  size: MaybeRefOrGetter<string | number | undefined>,
  enabled: MaybeRefOrGetter<boolean | undefined>,
  emit: {
    (event: "resize-start", evt: MouseEvent, size: number): void;
    (event: "resize", evt: MouseEvent, size: number): void;
    (event: "resize-end", evt: MouseEvent, size: number): void;
  }
) {
  const customSize = ref<number | null>(null);
  const isResizing = ref(false);
  const isHorizontal = computed(() => {
    const value = toValue(direction);
    return value === "ltr" || value === "rtl";
  });
  const resolvedDirection = computed(() => toValue(direction));
  let startPointer = 0;
  let startSize = 0;

  function getViewportSize() {
    return isHorizontal.value ? window.innerWidth : window.innerHeight;
  }

  function getPanelSize() {
    const panel = panelRef.value;

    if (!panel) {
      return 0;
    }

    return isHorizontal.value ? panel.offsetWidth : panel.offsetHeight;
  }

  function getPointer(event: MouseEvent) {
    return isHorizontal.value ? event.pageX : event.pageY;
  }

  function getDirectionSign() {
    const value = resolvedDirection.value;
    return value === "ltr" || value === "ttb" ? 1 : -1;
  }

  function getNextSize(pointer: number) {
    const nextSize = startSize + getDirectionSign() * (pointer - startPointer);
    return clamp(nextSize, 4, getViewportSize());
  }

  function cleanupListeners() {
    window.removeEventListener("mousemove", handlePointerMove);
    window.removeEventListener("mouseup", handlePointerUp);
  }

  function handlePointerMove(event: MouseEvent) {
    if (!isResizing.value) {
      return;
    }

    const nextSize = getNextSize(getPointer(event));
    customSize.value = nextSize;
    emit("resize", event, nextSize);
  }

  function handlePointerUp(event: MouseEvent) {
    if (!isResizing.value) {
      return;
    }

    const nextSize = getNextSize(getPointer(event));
    customSize.value = nextSize;
    startSize = nextSize;
    isResizing.value = false;
    cleanupListeners();
    emit("resize-end", event, nextSize);
  }

  function handleDragStart(event: MouseEvent) {
    if (!toValue(enabled) || event.button !== 0) {
      return;
    }

    event.preventDefault();
    startPointer = getPointer(event);
    startSize = customSize.value ?? getPanelSize();
    isResizing.value = true;
    cleanupListeners();
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    emit("resize-start", event, startSize);
  }

  watch(
    () => [toValue(size), resolvedDirection.value],
    () => {
      customSize.value = null;
      isResizing.value = false;
      cleanupListeners();
    }
  );

  watch(
    () => toValue(enabled),
    (value) => {
      if (value) {
        return;
      }

      customSize.value = null;
      isResizing.value = false;
      cleanupListeners();
    }
  );

  onBeforeUnmount(() => {
    cleanupListeners();
  });

  return {
    isHorizontal,
    isResizing,
    resolvedSize: computed(() => customSize.value == null ? addUnit(toValue(size)) : `${customSize.value}px`),
    handleDragStart
  };
}
