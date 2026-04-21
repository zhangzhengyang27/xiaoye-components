<script setup lang="ts">
import { computed, inject } from "vue";
import type { Component } from "vue";

export interface DisclosurePanelProps {
  as?: string | Component;
  static?: boolean;
}

const props = withDefaults(defineProps<DisclosurePanelProps>(), {
  as: "div",
  static: false
});

const slots = defineSlots<{
  default?: (props: { open: boolean }) => unknown;
}>();

const disclosureContext = inject<{
  isOpen: Ref<boolean>;
} | null>("xy-disclosure-context", null);

const isVisible = computed(() => props.static || disclosureContext?.isOpen.value);
</script>

<template>
  <component
    v-if="isVisible"
    :is="props.as"
    :class="['xy-disclosure__panel', { 'is-open': disclosureContext?.isOpen.value }]"
    :aria-hidden="!disclosureContext?.isOpen.value"
  >
    <slot :open="disclosureContext?.isOpen.value ?? false" />
  </component>
</template>
