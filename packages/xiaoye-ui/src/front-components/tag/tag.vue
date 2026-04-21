<script setup lang="ts">
import { computed } from "vue";
import type { TagProps } from "./tag";

const props = withDefaults(defineProps<TagProps>(), {
  type: "default",
  size: "md",
  round: false,
  closable: false,
  closableIcon: true
});

const emit = defineEmits<{
  close: [event: MouseEvent];
}>();

const ns = "xyu-tag";

const tagClasses = computed(() => [
  ns,
  `${ns}--${props.type}`,
  `${ns}--${props.size}`,
  props.round ? "is-round" : "",
  props.closable ? "is-closable" : ""
]);

function handleClose(e: MouseEvent) {
  emit("close", e);
}
</script>

<template>
  <span :class="tagClasses">
    <span :class="`${ns}__content`">
      <slot />
    </span>
    <button
      v-if="props.closable && props.closableIcon"
      :class="`${ns}__close`"
      type="button"
      aria-label="关闭"
      @click="handleClose"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </span>
</template>
