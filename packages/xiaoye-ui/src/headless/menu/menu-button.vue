<script setup lang="ts">
import { computed, inject } from "vue";
import type { Component, PropType } from "vue";

export interface MenuButtonProps {
  as?: string | Component;
}

const props = withDefaults(defineProps<MenuButtonProps>(), {
  as: "button"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const menuContext = inject<{
  buttonRef: Ref<HTMLElement | null>;
  isOpen: Ref<boolean>;
  toggle: () => void;
} | null>("xy-menu-context", null);

const buttonRef = computed({
  get: () => menuContext?.buttonRef.value ?? null,
  set: (el) => {
    if (menuContext?.buttonRef) {
      menuContext.buttonRef.value = el;
    }
  }
});

function handleClick() {
  menuContext?.toggle();
}

const ariaExpanded = computed(() => menuContext?.isOpen.value ?? false);
</script>

<template>
  <component
    :is="props.as"
    ref="buttonRef"
    class="xy-menu__button"
    :aria-expanded="ariaExpanded"
    aria-haspopup="true"
    @click="handleClick"
  >
    <slot />
  </component>
</template>
