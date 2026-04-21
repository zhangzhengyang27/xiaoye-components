<script setup lang="ts">
import { computed } from "vue";
import type { LinkProps } from "./link";

const props = withDefaults(defineProps<LinkProps>(), {
  type: "default",
  underline: "hover",
  disabled: false,
  target: "_self",
  rel: ""
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const ns = "xyu-link";

const linkClasses = computed(() => [
  ns,
  `${ns}--${props.type}`,
  `is-underline-${props.underline}`,
  props.disabled ? "is-disabled" : ""
]);

function handleClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  emit("click", e);
}
</script>

<template>
  <a
    :class="linkClasses"
    :href="disabled ? undefined : props.href"
    :target="disabled ? undefined : props.target"
    :rel="props.rel || (props.target === '_blank' ? 'noopener noreferrer' : '')"
    :tabindex="disabled ? -1 : 0"
    @click="handleClick"
  >
    <slot />
  </a>
</template>
