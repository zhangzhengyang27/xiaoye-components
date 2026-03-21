<script setup lang="ts">
import { computed } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { builtinIcons } from "./icons";

export interface IconProps {
  name?: keyof typeof builtinIcons;
  size?: number | string;
  rotate?: number;
  spin?: boolean;
}

const props = withDefaults(defineProps<IconProps>(), {
  name: "info",
  size: 16,
  rotate: 0,
  spin: false
});

const ns = useNamespace("icon");

const path = computed(() => builtinIcons[props.name] ?? builtinIcons.info);
const pixelSize = computed(() =>
  typeof props.size === "number" ? `${props.size}px` : props.size
);
const style = computed(() => ({
  width: pixelSize.value,
  height: pixelSize.value,
  transform: `rotate(${props.rotate}deg)`
}));
</script>

<template>
  <span :class="[ns.base.value, ns.is('spin', props.spin)]" aria-hidden="true">
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      :style="style"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path :d="path" />
    </svg>
  </span>
</template>

