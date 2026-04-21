<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import { useFloatingPanel, useZIndex } from "xiaoye-primitives";

export interface MenuRootProps {
  open?: boolean;
  placement?: string;
  offset?: number;
}

const props = withDefaults(defineProps<MenuRootProps>(), {
  open: false,
  placement: "bottom-start",
  offset: 8
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

watch(isOpen, (value) => {
  if (value) {
    updatePosition();
  }
});

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

provide("xy-menu-context", context);

defineExpose({
  open,
  close,
  toggle
});
</script>

<template>
  <div class="xy-menu-root">
    <slot />
  </div>
</template>
