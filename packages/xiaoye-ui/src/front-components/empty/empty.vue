<script setup lang="ts">
import type { EmptyProps } from "./empty";

const props = withDefaults(defineProps<EmptyProps>(), {
  description: "暂无数据",
  image: "",
  size: "md"
});

const slots = defineSlots<{
  default?: () => unknown;
  image?: () => unknown;
}>();
</script>

<template>
  <div :class="['xyu-empty', `xyu-empty--${props.size}`]">
    <div :class="`xyu-empty__image`">
      <slot name="image">
        <svg
          v-if="!props.image"
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="8" y="8" width="48" height="48" rx="8" fill="var(--xyu-bg-tertiary)" />
          <path
            d="M24 32L28 36L40 24"
            stroke="var(--xyu-text-tertiary)"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20 24H44"
            stroke="var(--xyu-text-tertiary)"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            d="M20 40H36"
            stroke="var(--xyu-text-tertiary)"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </slot>
    </div>
    <p :class="`xyu-empty__description`">
      <slot>{{ props.description }}</slot>
    </p>
    <div v-if="slots.default" :class="`xyu-empty__extra`">
      <slot />
    </div>
  </div>
</template>
