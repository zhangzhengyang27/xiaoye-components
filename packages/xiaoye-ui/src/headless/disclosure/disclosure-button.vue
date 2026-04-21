<script setup lang="ts">
import { computed, inject } from "vue";
import type { Component } from "vue";

export interface DisclosureButtonProps {
  as?: string | Component;
}

const props = withDefaults(defineProps<DisclosureButtonProps>(), {
  as: "button"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const disclosureContext = inject<{
  toggle: () => void;
  isOpen: Ref<boolean>;
} | null>("xy-disclosure-context", null);

const buttonRef = ref<HTMLElement | null>(null);

function handleClick() {
  disclosureContext?.toggle();
}
</script>

<template>
  <component
    :is="props.as"
    ref="buttonRef"
    :class="['xy-disclosure__button', { 'is-open': disclosureContext?.isOpen.value }]"
    :aria-expanded="disclosureContext?.isOpen.value ?? false"
    @click="handleClick"
  >
    <slot>{{ disclosureContext?.isOpen.value ? "Collapse" : "Expand" }}</slot>
  </component>
</template>
