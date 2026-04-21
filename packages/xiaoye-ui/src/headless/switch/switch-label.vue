<script setup lang="ts">
import { computed, inject } from "vue";
import type { Component } from "vue";

export interface SwitchLabelProps {
  as?: string | Component;
  passive?: boolean;
}

const props = withDefaults(defineProps<SwitchLabelProps>(), {
  as: "label",
  passive: false
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const labelId = computed(() => "xy-switch-label");
</script>

<template>
  <component :is="props.as" :id="labelId" class="xy-switch__label">
    <slot />
  </component>
</template>
