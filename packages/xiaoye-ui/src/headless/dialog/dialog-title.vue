<script setup lang="ts">
import { computed, inject } from "vue";
import type { Component } from "vue";

export interface DialogTitleProps {
  as?: string | Component;
}

const props = withDefaults(defineProps<DialogTitleProps>(), {
  as: "h2"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const dialogContext = inject<{
  panelRef: Ref<HTMLElement | null>;
} | null>("xy-dialog-context", null);

const titleId = computed(() => "xy-dialog-title");
</script>

<template>
  <component :is="props.as" :id="titleId" class="xy-dialog__title">
    <slot />
  </component>
</template>
