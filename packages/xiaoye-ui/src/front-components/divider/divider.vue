<script setup lang="ts">
import type { DividerProps } from "./divider";

const props = withDefaults(defineProps<DividerProps>(), {
  direction: "horizontal",
  borderStyle: "solid",
  contentPosition: "center"
});

const ns = "xyu-divider";

const slots = defineSlots<{
  default?: () => unknown;
}>();
</script>

<template>
  <div
    v-if="props.direction === 'vertical'"
    :class="ns"
    :style="{
      borderLeftStyle: props.borderStyle,
      color: props.color,
      margin: '0 8px'
    }"
  />
  <div
    v-else
    :class="[ns, `${ns}--${props.contentPosition}`]"
    :style="{
      borderTopStyle: props.borderStyle,
      color: props.color
    }"
  >
    <span v-if="slots.default" :class="`${ns}__text`">
      <slot />
    </span>
  </div>
</template>
