<script setup lang="ts">
import { computed, inject } from "vue";
import type { Component } from "vue";

export interface PopoverButtonProps {
  as?: string | Component;
}

const props = withDefaults(defineProps<PopoverButtonProps>(), {
  as: "button"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const popoverContext = inject<{
  buttonRef: Ref<HTMLElement | null>;
  isOpen: Ref<boolean>;
  toggle: () => void;
} | null>("xy-popover-context", null);

const buttonRef = computed({
  get: () => popoverContext?.buttonRef.value ?? null,
  set: (el) => {
    if (popoverContext?.buttonRef) {
      popoverContext.buttonRef.value = el;
    }
  }
});

function handleClick() {
  popoverContext?.toggle();
}
</script>

<template>
  <component
    :is="props.as"
    ref="buttonRef"
    :class="['xy-popover__button']"
    :aria-expanded="popoverContext?.isOpen.value ?? false"
    aria-haspopup="true"
    @click="handleClick"
  >
    <slot />
  </component>
</template>
