<script setup lang="ts">
import { computed, provide } from "vue";
import type { ConfigProviderProps } from "./context";
import { configProviderKey } from "./context";

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  namespace: "xy",
  locale: () => ({}),
  zIndex: 2000,
  size: "md"
});

provide(configProviderKey, {
  namespace: computed(() => props.namespace),
  locale: computed(() => props.locale),
  zIndex: computed(() => props.zIndex),
  size: computed(() => props.size)
});
</script>

<template>
  <div :class="`${props.namespace}-provider`">
    <slot />
  </div>
</template>

