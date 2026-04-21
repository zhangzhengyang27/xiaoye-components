<script setup lang="ts">
import { computed } from "vue";
import type { TagProps } from "./tag";
import XyuIcon from "../icon/icon.vue";

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
      <XyuIcon icon="mdi:close" :size="10" />
    </button>
  </span>
</template>
