import { computed, onBeforeUnmount, onMounted, ref, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useDialogDrag(
  dialogRef: MaybeRefOrGetter<HTMLElement | null>,
  headerRef: MaybeRefOrGetter<HTMLElement | null>,
  draggable: MaybeRefOrGetter<boolean>,
  overflow: MaybeRefOrGetter<boolean>,
  fullscreen: MaybeRefOrGetter<boolean>
) {
  const x = ref(0);
  const y = ref(0);
  const isDragging = ref(false);
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;
  let lastPosition = { x: 0, y: 0 };

  const dragStyle = computed(() => ({
    transform: !toValue(fullscreen) && (x.value !== 0 || y.value !== 0)
      ? `translate(${x.value}px, ${y.value}px)`
      : undefined
  }));

  function updatePosition() {
    const dialog = toValue(dialogRef);

    if (!dialog || typeof window === "undefined") {
      return;
    }

    if (toValue(fullscreen)) {
      x.value = 0;
      y.value = 0;
      return;
    }

    if (toValue(overflow)) {
      return;
    }

    const rect = dialog.getBoundingClientRect();
    const minX = -rect.left;
    const maxX = window.innerWidth - rect.right;
    const minY = -rect.top;
    const maxY = window.innerHeight - rect.bottom;

    x.value = clamp(x.value, x.value + minX, x.value + maxX);
    y.value = clamp(y.value, y.value + minY, y.value + maxY);
  }

  function resetPosition() {
    x.value = 0;
    y.value = 0;
  }

  function stopDrag() {
    isDragging.value = false;
  }

  function handlePointerMove(event: MouseEvent) {
    if (!isDragging.value) {
      return;
    }

    const nextX = originX + event.clientX - startX;
    const nextY = originY + event.clientY - startY;

    if (toValue(overflow)) {
      x.value = nextX;
      y.value = nextY;
      return;
    }

    const dialog = toValue(dialogRef);

    if (!dialog || typeof window === "undefined") {
      return;
    }

    const rect = dialog.getBoundingClientRect();
    const minX = originX - rect.left;
    const maxX = originX + (window.innerWidth - rect.right);
    const minY = originY - rect.top;
    const maxY = originY + (window.innerHeight - rect.bottom);

    x.value = clamp(nextX, minX, maxX);
    y.value = clamp(nextY, minY, maxY);
  }

  function handlePointerUp() {
    stopDrag();
  }

  function handlePointerDown(event: MouseEvent) {
    const target = event.target as HTMLElement | null;

    if (
      event.button !== 0 ||
      !toValue(draggable) ||
      toValue(fullscreen) ||
      !toValue(headerRef)?.contains(target) ||
      target?.closest("button, a, input, textarea, select, option, [data-no-dialog-drag]")
    ) {
      return;
    }

    startX = event.clientX;
    startY = event.clientY;
    originX = x.value;
    originY = y.value;
    isDragging.value = true;
    event.preventDefault();
  }

  watch(
    () => toValue(fullscreen),
    (value) => {
      if (value) {
        lastPosition = {
          x: x.value,
          y: y.value
        };
        resetPosition();
        return;
      }

      x.value = lastPosition.x;
      y.value = lastPosition.y;
      updatePosition();
    }
  );

  watch(
    () => toValue(draggable),
    (value) => {
      if (!value) {
        stopDrag();
        resetPosition();
      }
    }
  );

  watch(
    () => [toValue(overflow), x.value, y.value],
    () => {
      if (!toValue(overflow)) {
        updatePosition();
      }
    }
  );

  function handleResize() {
    updatePosition();
  }

  onMounted(() => {
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("resize", handleResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("mousemove", handlePointerMove);
    window.removeEventListener("mouseup", handlePointerUp);
    window.removeEventListener("resize", handleResize);
  });

  return {
    dragStyle,
    handlePointerDown,
    isDragging,
    resetPosition,
    updatePosition
  };
}
