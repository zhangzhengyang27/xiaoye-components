<script setup lang="ts">
import { computed, inject, onMounted, provide, ref } from "vue";
import type { Component } from "vue";

export interface TabListProps {
  as?: string | Component;
}

const props = withDefaults(defineProps<TabListProps>(), {
  as: "div"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();
</script>

<template>
  <component :is="props.as" class="xy-tab-list" role="tablist">
    <slot />
  </component>
</template>
