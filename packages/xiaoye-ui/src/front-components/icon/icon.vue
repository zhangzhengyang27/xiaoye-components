<script setup lang="ts">
import { computed } from "vue";
import { Icon as IconifyIcon } from "@iconify/vue";
import { registerLocalMdiCollection } from "./mdi";

registerLocalMdiCollection();

const props = withDefaults(
  defineProps<{
    icon: string;
    size?: number | string;
    rotate?: number;
    spin?: boolean;
  }>(),
  {
    size: 16,
    rotate: 0,
    spin: false
  }
);

const ns = "xyu-icon";

const pixelSize = computed(() =>
  typeof props.size === "number" ? `${props.size}px` : props.size
);

const style = computed(() => ({
  width: pixelSize.value,
  height: pixelSize.value,
  transform: props.rotate ? `rotate(${props.rotate}deg)` : undefined,
  animation: props.spin ? "xyu-icon-spin 1s linear infinite" : undefined
}));
</script>

<template>
  <span :class="[ns, props.spin ? 'is-spin' : '']" aria-hidden="true">
    <IconifyIcon :icon="props.icon" :style="style" focusable="false" />
  </span>
</template>
