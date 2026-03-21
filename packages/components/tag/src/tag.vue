<script setup lang="ts">
import type { ComponentSize, ComponentStatus } from "@xiaoye/utils";
import { useConfig, useNamespace } from "@xiaoye/composables";
import { computed } from "vue";

export interface TagProps {
  status?: ComponentStatus;
  size?: ComponentSize;
  round?: boolean;
  closable?: boolean;
}

const props = withDefaults(defineProps<TagProps>(), {
  status: "neutral",
  size: undefined,
  round: false,
  closable: false
});

const emit = defineEmits<{
  close: [event: MouseEvent];
}>();

const { size: globalSize } = useConfig();
const ns = useNamespace("tag");
const mergedSize = computed(() => props.size ?? globalSize.value);
</script>

<template>
  <span
    :class="[
      ns.base.value,
      `${ns.base.value}--${props.status}`,
      `${ns.base.value}--${mergedSize}`,
      ns.is('round', props.round)
    ]"
  >
    <slot />
    <button
      v-if="props.closable"
      class="xy-tag__close"
      type="button"
      aria-label="close"
      @click="emit('close', $event)"
    >
      ×
    </button>
  </span>
</template>

