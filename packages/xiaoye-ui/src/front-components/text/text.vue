<script setup lang="ts">
import { computed } from "vue";
import type { TextProps } from "./text";

const props = withDefaults(defineProps<TextProps>(), {
  tag: "span",
  size: "base",
  type: "primary",
  strong: false,
  italic: false,
  delete: false,
  underline: false,
  mark: false,
  lineClamp: 0,
  ellipsis: false,
  ellipsisLineClamp: 1
});

const ns = "xyu-text";

const textClasses = computed(() => [
  ns,
  `${ns}--${props.size}`,
  `${ns}--${props.type}`,
  props.strong ? "is-strong" : "",
  props.italic ? "is-italic" : "",
  props.delete ? "is-delete" : "",
  props.underline ? "is-underline" : "",
  props.mark ? "is-mark" : "",
  props.lineClamp > 0 ? `is-clamp-${props.lineClamp}` : "",
  props.ellipsis ? "is-ellipsis" : "",
  props.ellipsisLineClamp > 1 ? `is-ellipsis-${props.ellipsisLineClamp}` : ""
]);

const textStyle = computed(() => {
  const lines = props.lineClamp > 0 ? props.lineClamp : props.ellipsisLineClamp;
  if (lines > 1) {
    return {
      display: "-webkit-box",
      WebkitLineClamp: lines,
      WebkitBoxOrient: "vertical" as const,
      overflow: "hidden"
    };
  }
  return {};
});
</script>

<template>
  <component :is="props.tag" :class="textClasses" :style="textStyle">
    <slot />
  </component>
</template>
