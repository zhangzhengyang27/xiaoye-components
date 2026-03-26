<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from "vue";
import XyTooltip from "../../tooltip";

const props = withDefaults(
  defineProps<{
    content?: unknown;
    tooltipContent?: unknown;
    showTooltip?: boolean;
  }>(),
  {
    tooltipContent: undefined,
    showTooltip: false
  }
);

const textRef = ref<HTMLElement | null>(null);
const isOverflow = ref(false);
const normalizedContent = computed(() =>
  props.content === null || props.content === undefined ? "" : String(props.content)
);
const normalizedTooltipContent = computed(() => {
  const content = props.tooltipContent ?? props.content;
  return content === null || content === undefined ? "" : String(content);
});

function syncOverflow() {
  const element = textRef.value;

  if (!element) {
    return;
  }

  isOverflow.value = element.offsetWidth > 0 && element.scrollWidth > element.offsetWidth;
}

onMounted(syncOverflow);
onUpdated(syncOverflow);
</script>

<template>
  <xy-tooltip
    v-if="props.showTooltip"
    :content="normalizedTooltipContent"
    :disabled="!isOverflow || normalizedTooltipContent === ''"
    placement="top"
  >
    <span ref="textRef" class="xy-table__cell-text">{{ normalizedContent }}</span>
  </xy-tooltip>
  <span v-else ref="textRef" class="xy-table__cell-text">{{ normalizedContent }}</span>
</template>
