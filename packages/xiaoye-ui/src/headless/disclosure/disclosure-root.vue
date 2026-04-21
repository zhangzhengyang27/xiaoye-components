<script setup lang="ts">
import { computed, provide, ref, watch } from "vue";
import type { Component } from "vue";

export interface DisclosureRootProps {
  as?: string | Component;
}

const props = withDefaults(defineProps<DisclosureRootProps>(), {
  as: "div"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const isOpen = ref(false);

function toggle() {
  isOpen.value = !isOpen.value;
}

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

const context = {
  isOpen,
  toggle,
  open,
  close
};

provide("xy-disclosure-context", context);

defineExpose({
  toggle,
  open,
  close
});
</script>

<template>
  <component :is="props.as" class="xy-disclosure-root">
    <slot />
  </component>
</template>
