<script setup lang="ts">
import { computed } from "vue";
import type { Component } from "vue";

export interface DialogDescriptionProps {
  as?: string | Component;
}

const props = withDefaults(defineProps<DialogDescriptionProps>(), {
  as: "p"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const descriptionId = computed(() => "xy-dialog-description");
</script>

<template>
  <component :is="props.as" :id="descriptionId" class="xy-dialog__description">
    <slot />
  </component>
</template>
