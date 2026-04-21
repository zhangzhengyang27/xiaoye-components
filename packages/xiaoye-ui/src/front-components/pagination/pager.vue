<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    page: number;
    current: number;
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

const ns = "xyu-pagination";
const isActive = computed(() => props.page === props.current);
</script>

<template>
  <button
    type="button"
    :class="[`${ns}__pager`, isActive ? 'is-active' : '']"
    :disabled="props.disabled"
  >
    {{ props.page }}
  </button>
</template>
