<script setup lang="ts">
import { computed, inject, ref } from "vue";
import type { Component, VNode } from "vue";

export interface DialogPanelProps {
  as?: string | Component;
  static?: boolean;
}

const props = withDefaults(defineProps<DialogPanelProps>(), {
  as: "div",
  static: false
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const dialogContext = inject<{
  panelRef: Ref<HTMLElement | null>;
  zIndex: Ref<number>;
} | null>("xy-dialog-context", null);

const panelRef = ref<HTMLElement | null>(null);

const panelClasses = computed(() => [
  "xy-dialog__panel",
  props.static ? "xy-dialog__panel--static" : ""
]);

const panelStyle = computed(() => ({
  zIndex: dialogContext?.zIndex.value
}));

function handleClickOutside(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    dialogContext?.close();
  }
}
</script>

<template>
  <component
    :is="props.as"
    ref="panelRef"
    :class="panelClasses"
    :style="panelStyle"
    role="dialog"
    aria-modal="true"
    @click="handleClickOutside"
  >
    <slot />
  </component>
</template>
