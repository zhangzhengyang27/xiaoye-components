<script setup lang="ts">
import { computed } from "vue";
import type { Component } from "vue";

export interface RadioGroupLabelProps {
  as?: string | Component;
}

const props = withDefaults(defineProps<RadioGroupLabelProps>(), {
  as: "span"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const labelId = computed(() => "xy-radio-group-label");
</script>

<template>
  <component :is="props.as" :id="labelId" class="xy-radio-group__label">
    <slot />
  </component>
</template>
