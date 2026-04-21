<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import type { Component, PropType } from "vue";

export interface MenuItemsProps {
  as?: string | Component;
  static?: boolean;
  unmount?: boolean;
}

const props = withDefaults(defineProps<MenuItemsProps>(), {
  as: "div",
  static: false,
  unmount: true
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const menuContext = inject<{
  panelRef: Ref<HTMLElement | null>;
  isOpen: Ref<boolean>;
  floatingStyle: { value: Record<string, unknown> };
  zIndex: Ref<number>;
} | null>("xy-menu-context", null);

const panelRef = computed({
  get: () => menuContext?.panelRef.value ?? null,
  set: (el) => {
    if (menuContext?.panelRef) {
      menuContext.panelRef.value = el;
    }
  }
});

const panelStyle = computed(() => ({
  ...menuContext?.floatingStyle.value,
  zIndex: menuContext?.zIndex.value
}));

const isRendered = computed(() => props.static || menuContext?.isOpen.value);
const isVisible = computed(() => !props.unmount || menuContext?.isOpen.value);
</script>

<template>
  <component
    v-if="isVisible"
    :is="props.as"
    ref="panelRef"
    :class="['xy-menu__items', props.static ? 'xy-menu__items--static' : '']"
    :style="panelStyle"
    role="menu"
  >
    <slot v-if="isRendered" />
  </component>
</template>
