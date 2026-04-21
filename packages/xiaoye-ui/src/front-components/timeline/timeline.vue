<script setup lang="ts">
import { computed } from "vue";
import type { TimelineProps, TimelineEmits } from "./timeline";

const props = withDefaults(defineProps<TimelineProps>(), {
  mode: "left",
  direction: "vertical",
  reverse: false
});

const emit = defineEmits<TimelineEmits>();

const ns = "xyu-timeline";

function handleClick(item: any) {
  emit("click", item);
}

const slots = defineSlots<{
  default?: () => unknown;
}>();
</script>

<template>
  <div
    :class="[ns, `${ns}--${props.direction}`, `${ns}--${props.mode}`]"
  >
    <slot />
  </div>
</template>
