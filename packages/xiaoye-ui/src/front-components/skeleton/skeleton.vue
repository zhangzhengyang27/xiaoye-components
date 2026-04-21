<script setup lang="ts">
import { computed } from "vue";
import type { SkeletonProps } from "./skeleton";

const props = withDefaults(defineProps<SkeletonProps>(), {
  variant: "text",
  size: "md",
  loading: true,
  animated: true,
  rows: 3
});

const slots = defineSlots<{
  template?: () => unknown;
  default?: () => unknown;
}>();

const ns = "xyu-skeleton";

const sizeMap: Record<string, string> = {
  sm: "12px",
  md: "14px",
  lg: "18px"
};

const skeletonStyle = computed(() => ({
  width: props.width ? (typeof props.width === "number" ? `${props.width}px` : props.width) : undefined,
  height: props.height ? (typeof props.height === "number" ? `${props.height}px` : props.height) : undefined
}));

const lineHeight = computed(() => sizeMap[props.size]);
</script>

<template>
  <div :class="ns">
    <template v-if="props.loading">
      <slot name="template">
        <!-- 默认骨架屏 -->
        <div
          v-for="i in props.rows"
          :key="i"
          :class="[`${ns}__item`, `${ns}__item--${props.variant}`]"
          :style="{
            ...skeletonStyle,
            height: props.variant === 'text' ? lineHeight : skeletonStyle.height
          }"
        />
      </slot>
    </template>
    <slot v-else />
  </div>
</template>
