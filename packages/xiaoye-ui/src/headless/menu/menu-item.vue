<script setup lang="ts">
import { computed, inject } from "vue";
import type { Component, PropType } from "vue";

export interface MenuItemProps {
  disabled?: boolean;
  as?: string | Component;
}

const props = withDefaults(defineProps<MenuItemProps>(), {
  disabled: false,
  as: "button"
});

const slots = defineSlots<{
  default?: (props: { active: boolean; disabled: boolean; close: () => void }) => unknown;
}>();

const menuContext = inject<{
  close: () => void;
} | null>("xy-menu-context", null);

const isActive = computed(() => false);
const mergedDisabled = computed(() => props.disabled);

function handleClick() {
  if (mergedDisabled.value) return;
  menuContext?.close();
}
</script>

<template>
  <component
    :is="props.as"
    :class="[
      'xy-menu__item',
      {
        'is-active': isActive,
        'is-disabled': mergedDisabled
      }
    ]"
    :aria-disabled="mergedDisabled"
    role="menuitem"
    @click="handleClick"
  >
    <slot :active="isActive" :disabled="mergedDisabled" :close="menuContext?.close ?? (() => {})" />
  </component>
</template>
