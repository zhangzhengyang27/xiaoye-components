<script setup lang="ts">
import { computed, inject, ref } from "vue";
import type { Component } from "vue";

export interface PopoverPanelProps {
  as?: string | Component;
  static?: boolean;
  unmount?: boolean;
}

const props = withDefaults(defineProps<PopoverPanelProps>(), {
  as: "div",
  static: false,
  unmount: true
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const popoverContext = inject<{
  panelRef: Ref<HTMLElement | null>;
  isOpen: Ref<boolean>;
  floatingStyle: { value: Record<string, unknown> };
  zIndex: Ref<number>;
} | null>("xy-popover-context", null);

const panelRef = computed({
  get: () => popoverContext?.panelRef.value ?? null,
  set: (el) => {
    if (popoverContext?.panelRef) {
      popoverContext.panelRef.value = el;
    }
  }
});

const panelStyle = computed(() => ({
  ...popoverContext?.floatingStyle.value,
  zIndex: popoverContext?.zIndex.value
}));

const isRendered = computed(() => props.static || popoverContext?.isOpen.value);
const isVisible = computed(() => !props.unmount || popoverContext?.isOpen.value);
</script>

<template>
  <component
    v-if="isVisible"
    :is="props.as"
    ref="panelRef"
    :class="['xy-popover__panel', props.static ? 'xy-popover__panel--static' : '']"
    :style="panelStyle"
    role="dialog"
  >
    <slot v-if="isRendered" />
  </component>
</template>
