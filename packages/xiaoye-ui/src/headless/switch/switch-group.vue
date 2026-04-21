<script setup lang="ts">
import { computed, provide, ref } from "vue";
import type { Component } from "vue";

export interface SwitchGroupProps {
  as?: string | Component;
}

const props = withDefaults(defineProps<SwitchGroupProps>(), {
  as: "div"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const context = {
  switchGroup: true
};

provide("xy-switch-group-context", context);
</script>

<template>
  <component :is="props.as" class="xy-switch-group">
    <slot />
  </component>
</template>
