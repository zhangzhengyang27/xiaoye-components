<script setup lang="ts">
import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useNamespace, useZIndex } from "@xiaoye/composables";

export interface TooltipProps {
  content?: string;
  placement?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  enterable?: boolean;
}

const props = withDefaults(defineProps<TooltipProps>(), {
  content: "",
  placement: "top",
  disabled: false,
  openDelay: 80,
  closeDelay: 60,
  enterable: true
});

const ns = useNamespace("tooltip");
const { next } = useZIndex();
const visible = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const floatingStyle = ref<Record<string, string>>({});
const tooltipId = `xy-tooltip-${Math.random().toString(36).slice(2, 10)}`;
let openTimer: number | null = null;
let closeTimer: number | null = null;
let cleanup: (() => void) | null = null;

function clearTimers() {
  if (openTimer) {
    window.clearTimeout(openTimer);
    openTimer = null;
  }

  if (closeTimer) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function open() {
  if (props.disabled) {
    return;
  }

  clearTimers();

  if (visible.value) {
    return;
  }

  openTimer = window.setTimeout(() => {
    visible.value = true;
  }, props.openDelay);
}

function close() {
  clearTimers();
  closeTimer = window.setTimeout(() => {
    visible.value = false;
  }, props.closeDelay);
}

function closeImmediately() {
  clearTimers();
  visible.value = false;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeImmediately();
  }
}

async function updatePosition() {
  if (!triggerRef.value || !contentRef.value) {
    return;
  }

  const { x, y } = await computePosition(triggerRef.value, contentRef.value, {
    placement: props.placement,
    middleware: [offset(10), flip(), shift({ padding: 8 })]
  });

  floatingStyle.value = {
    left: `${x}px`,
    top: `${y}px`,
    zIndex: `${next()}`
  };
}

watch(visible, async (value) => {
  cleanup?.();
  cleanup = null;

  if (!value) {
    return;
  }

  await nextTick();
  await updatePosition();

  if (triggerRef.value && contentRef.value) {
    cleanup = autoUpdate(triggerRef.value, contentRef.value, updatePosition);
  }
});

onBeforeUnmount(() => {
  clearTimers();
  cleanup?.();
});
</script>

<template>
  <span
    ref="triggerRef"
    :class="ns.base.value"
    :aria-describedby="visible ? tooltipId : undefined"
    @mouseenter="open"
    @mouseleave="close"
    @focusin="open"
    @focusout="close"
    @keydown="handleKeydown"
  >
    <slot />
    <teleport to="body">
      <transition name="xy-fade">
        <div
          v-if="visible"
          :id="tooltipId"
          ref="contentRef"
          role="tooltip"
          :class="`${ns.base.value}__content`"
          :style="floatingStyle"
          @mouseenter="props.enterable ? open() : undefined"
          @mouseleave="props.enterable ? close() : undefined"
          @keydown="handleKeydown"
        >
          <slot name="content">
            {{ props.content }}
          </slot>
        </div>
      </transition>
    </teleport>
  </span>
</template>
