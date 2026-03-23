<script setup lang="ts">
import { computed, onBeforeUnmount } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { SplitterCollapseDirection, SplitterLayout } from "./splitter";

const props = withDefaults(
  defineProps<{
    index: number;
    layout: SplitterLayout;
    lazy: boolean;
    resizable: boolean;
    active: boolean;
    activeOffset: number;
    startCollapsible: boolean;
    endCollapsible: boolean;
  }>(),
  {
    layout: "horizontal",
    lazy: false,
    resizable: true,
    active: false,
    activeOffset: 0,
    startCollapsible: false,
    endCollapsible: false
  }
);

const emit = defineEmits<{
  moveStart: [index: number];
  moving: [index: number, offset: number];
  moveEnd: [index: number];
  collapse: [index: number, direction: SplitterCollapseDirection];
}>();

const ns = useNamespace("splitter-bar");
const isHorizontal = computed(() => props.layout === "horizontal");

const barClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.layout}`,
  props.active ? "is-active" : "",
  props.lazy ? "is-lazy" : ""
]);
const draggerClasses = computed(() => [
  `${ns.base.value}__dragger`,
  `${ns.base.value}__dragger--${props.layout}`,
  props.active ? "is-active" : "",
  !props.resizable ? "is-disabled" : ""
]);

const draggerStyles = computed(() => {
  const translate = props.active && props.lazy ? props.activeOffset : 0;

  return isHorizontal.value
    ? {
        width: "20px",
        height: "100%",
        cursor: props.resizable ? "col-resize" : "default",
        transform: `translate(calc(-50% + ${translate}px), -50%)`
      }
    : {
        width: "100%",
        height: "20px",
        cursor: props.resizable ? "row-resize" : "default",
        transform: `translate(-50%, calc(-50% + ${translate}px))`
      };
});

let startPoint: { x: number; y: number } | null = null;

function cleanupListeners() {
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseup", handleMouseUp);
  window.removeEventListener("touchmove", handleTouchMove);
  window.removeEventListener("touchend", handleTouchEnd);
}

function startDrag(x: number, y: number) {
  if (!props.resizable) {
    return;
  }

  startPoint = { x, y };
  emit("moveStart", props.index);
}

function emitOffset(x: number, y: number) {
  if (!startPoint) {
    return;
  }

  const offset = isHorizontal.value ? x - startPoint.x : y - startPoint.y;
  emit("moving", props.index, offset);
}

function endDrag() {
  if (!startPoint) {
    cleanupListeners();
    return;
  }

  startPoint = null;
  cleanupListeners();
  emit("moveEnd", props.index);
}

function handleMouseMove(event: MouseEvent) {
  emitOffset(event.pageX || event.clientX, event.pageY || event.clientY);
}

function handleMouseUp() {
  endDrag();
}

function handleTouchMove(event: TouchEvent) {
  if (event.touches.length !== 1) {
    return;
  }

  event.preventDefault();
  const touch = event.touches[0];
  emitOffset(touch.pageX, touch.pageY);
}

function handleTouchEnd() {
  endDrag();
}

function handleMouseDown(event: MouseEvent) {
  event.preventDefault();
  startDrag(event.pageX || event.clientX, event.pageY || event.clientY);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
}

function handleTouchStart(event: TouchEvent) {
  if (event.touches.length !== 1) {
    return;
  }

  event.preventDefault();
  const touch = event.touches[0];
  startDrag(touch.pageX, touch.pageY);
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("touchend", handleTouchEnd);
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.resizable) {
    return;
  }

  const step = event.shiftKey ? 32 : 12;
  let offset = 0;

  if (isHorizontal.value) {
    if (event.key === "ArrowLeft") {
      offset = -step;
    } else if (event.key === "ArrowRight") {
      offset = step;
    }
  } else if (event.key === "ArrowUp") {
    offset = -step;
  } else if (event.key === "ArrowDown") {
    offset = step;
  }

  if (!offset) {
    return;
  }

  event.preventDefault();
  emit("moveStart", props.index);
  emit("moving", props.index, offset);
  emit("moveEnd", props.index);
}

function getCollapseLabel(direction: SplitterCollapseDirection) {
  if (isHorizontal.value) {
    return direction === "start" ? "折叠左侧面板" : "折叠右侧面板";
  }

  return direction === "start" ? "折叠上方面板" : "折叠下方面板";
}

function getCollapseIcon(direction: SplitterCollapseDirection) {
  if (isHorizontal.value) {
    return direction === "start" ? "<" : ">";
  }

  return direction === "start" ? "^" : "v";
}

onBeforeUnmount(() => {
  cleanupListeners();
});
</script>

<template>
  <div :class="barClasses">
    <button
      v-if="startCollapsible"
      type="button"
      :class="[
        `${ns.base.value}__collapse`,
        `${ns.base.value}__collapse--start`,
        `${ns.base.value}__collapse--${layout}`
      ]"
      :aria-label="getCollapseLabel('start')"
      @click="emit('collapse', index, 'start')"
    >
      {{ getCollapseIcon("start") }}
    </button>

    <button
      type="button"
      :class="draggerClasses"
      :style="draggerStyles"
      :aria-orientation="isHorizontal ? 'vertical' : 'horizontal'"
      aria-label="调整面板尺寸"
      role="separator"
      @mousedown="handleMouseDown"
      @touchstart="handleTouchStart"
      @keydown="handleKeydown"
    >
      <span :class="`${ns.base.value}__grip`" aria-hidden="true" />
    </button>

    <button
      v-if="endCollapsible"
      type="button"
      :class="[
        `${ns.base.value}__collapse`,
        `${ns.base.value}__collapse--end`,
        `${ns.base.value}__collapse--${layout}`
      ]"
      :aria-label="getCollapseLabel('end')"
      @click="emit('collapse', index, 'end')"
    >
      {{ getCollapseIcon("end") }}
    </button>
  </div>
</template>
