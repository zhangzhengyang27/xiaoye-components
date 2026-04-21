<script setup lang="ts">
import { computed } from "vue";
import type { Component } from "vue";

export interface PopoverHeadingProps {
  as?: string | Component;
}

const props = withDefaults(defineProps<PopoverHeadingProps>(), {
  as: "h3"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const headingId = computed(() => "xy-popover-heading");
</script>

<template>
  <component :is="props.as" :id="headingId" class="xy-popover__heading">
    <slot />
  </component>
</template>
