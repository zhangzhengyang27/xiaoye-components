<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import { useFloatingPanel, useZIndex } from "xiaoye-primitives";
import type { Component } from "vue";

export interface PopoverRootProps {
  open?: boolean;
  placement?: string;
  offset?: number;
  as?: string | Component;
}

const props = withDefaults(defineProps<PopoverRootProps>(), {
  open: false,
  placement: "top",
  offset: 8,
  as: "div"
});

const emit = defineEmits<{
  close: [];
}>();

const slots = defineSlots<{
  default?: () => unknown;
}>();

const isOpen = ref(props.open);
const buttonRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const { zIndex, onNextZIndex } = useZIndex();

const { actualPlacement, floatingStyle, updatePosition } = useFloatingPanel(buttonRef, panelRef, {
  placement: computed(() => props.placement),
  offset: computed(() => props.offset),
  zIndex
});

watch(
  () => props.open,
  (value) => {
    isOpen.value = value;
    if (value) {
      zIndex.value = onNextZIndex();
      updatePosition();
    }
  }
);

function open() {
  isOpen.value = true;
  zIndex.value = onNextZIndex();
  updatePosition();
}

function close() {
  isOpen.value = false;
  emit("close");
}

function toggle() {
  if (isOpen.value) {
    close();
  } else {
    open();
  }
}

const context = {
  isOpen,
  buttonRef,
  panelRef,
  zIndex,
  actualPlacement,
  floatingStyle,
  open,
  close,
  toggle,
  updatePosition
};

provide("xy-popover-context", context);

defineExpose({
  open,
  close,
  toggle
});
</script>

<template>
  <component :is="props.as" class="xy-popover-root">
    <slot />
  </component>
</template>
