<script setup lang="ts">
import { computed } from "vue";
import type { Component } from "vue";

export interface SwitchDescriptionProps {
  as?: string | Component;
}

const props = withDefaults(defineProps<SwitchDescriptionProps>(), {
  as: "p"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const descriptionId = computed(() => "xy-switch-description");
</script>

<template>
  <component :is="props.as" :id="descriptionId" class="xy-switch__description">
    <slot />
  </component>
</template>
