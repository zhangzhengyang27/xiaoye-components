<script setup lang="ts">
import { computed, provide } from "vue";
import type { StepsProps } from "./steps";

const props = withDefaults(defineProps<StepsProps>(), {
  active: 0,
  direction: "horizontal",
  alignCenter: false,
  simple: false,
  finishStatus: "finish",
  processStatus: "process"
});

defineSlots<{
  default?: () => unknown;
}>();

const ns = "xyu-steps";

provide("stepsDirection", props.direction);

const stepsClasses = computed(() => [
  ns,
  `${ns}--${props.direction}`,
  props.simple ? `${ns}--simple` : "",
  props.alignCenter && !props.simple ? "is-center" : ""
]);
</script>

<template>
  <div :class="stepsClasses">
    <slot />
  </div>
</template>
