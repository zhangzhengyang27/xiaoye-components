<script setup lang="ts">
import { computed } from "vue";
import { useNamespace } from "@xiaoye/composables";

export interface SpaceProps {
  size?: number | "sm" | "md" | "lg";
  direction?: "horizontal" | "vertical";
  wrap?: boolean;
  align?: "start" | "center" | "end" | "stretch";
}

const props = withDefaults(defineProps<SpaceProps>(), {
  size: "md",
  direction: "horizontal",
  wrap: false,
  align: "center"
});

const ns = useNamespace("space");

const gap = computed(() => {
  if (typeof props.size === "number") {
    return `${props.size}px`;
  }

  return {
    sm: "8px",
    md: "12px",
    lg: "16px"
  }[props.size];
});
</script>

<template>
  <div
    :class="[ns.base.value, `${ns.base.value}--${props.direction}`, ns.is('wrap', props.wrap)]"
    :style="{ gap, alignItems: props.align, flexWrap: props.wrap ? 'wrap' : 'nowrap' }"
  >
    <slot />
  </div>
</template>

