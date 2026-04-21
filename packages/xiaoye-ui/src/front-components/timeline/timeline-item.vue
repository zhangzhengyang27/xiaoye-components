<script setup lang="ts">
import { computed } from "vue";
import type { TimelineItemProps } from "./timeline";

const props = withDefaults(defineProps<TimelineItemProps>(), {
  status: "pending",
  hollow: false
});

const ns = "xyu-timeline-item";

const dotColor = computed(() => {
  if (props.color) return props.color;
  const map: Record<string, string> = {
    success: "var(--xyu-success)",
    error: "var(--xyu-error)",
    warning: "var(--xyu-warning)",
    processing: "var(--xyu-primary)"
  };
  return map[props.status] || "var(--xyu-text-secondary)";
});

const slots = defineSlots<{
  default?: () => unknown;
  dot?: () => unknown;
}>();
</script>

<template>
  <div :class="[ns]">
    <div :class="`${ns}__tail`" />
    <div
      :class="[`${ns}__dot`, props.hollow ? 'is-hollow' : '']"
      :style="{ borderColor: dotColor, color: dotColor }"
    >
      <slot name="dot">
        {{ props.dot || "●" }}
      </slot>
    </div>
    <div :class="`${ns}__content`">
      <div v-if="props.timestamp" :class="`${ns}__timestamp`">{{ props.timestamp }}</div>
      <div :class="`${ns}__body`">
        <slot />
      </div>
    </div>
  </div>
</template>
