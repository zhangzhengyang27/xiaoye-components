<script setup lang="ts">
import { computed, inject } from "vue";
import type { Component } from "vue";

export interface TabPanelsProps {
  as?: string | Component;
}

const props = withDefaults(defineProps<TabPanelsProps>(), {
  as: "div"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();
</script>

<template>
  <component :is="props.as" class="xy-tab-panels">
    <slot />
  </component>
</template>
