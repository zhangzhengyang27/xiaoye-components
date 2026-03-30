<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import XyTooltip from "../../tooltip";
import type { TableOverflowTooltipOptions } from "./table";

const props = withDefaults(
  defineProps<{
    content?: unknown;
    tooltipContent?: unknown;
    showTooltip?: boolean;
    tooltipOptions?: TableOverflowTooltipOptions | null;
  }>(),
  {
    content: undefined,
    tooltipContent: undefined,
    showTooltip: false,
    tooltipOptions: null
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
const hasTooltip = computed(() => props.showTooltip || props.tooltipOptions !== null);
const tooltipBindings = computed(() => ({
  content: normalizedTooltipContent.value,
  disabled: !isOverflow.value || normalizedTooltipContent.value === "",
  placement: props.tooltipOptions?.placement ?? "top",
  enterable: props.tooltipOptions?.enterable,
  hideAfter: props.tooltipOptions?.hideAfter,
  offset: props.tooltipOptions?.offset,
  popperClass: props.tooltipOptions?.popperClass,
  popperOptions: props.tooltipOptions?.popperOptions,
  showAfter: props.tooltipOptions?.showAfter,
  showArrow: props.tooltipOptions?.showArrow,
  effect: props.tooltipOptions?.effect
}));
const textClass = computed(() => [
  "xy-table__cell-text",
  hasTooltip.value ? "xy-table__cell-text--tooltip" : ""
]);

function syncOverflow() {
  const element = textRef.value;

  if (!element) {
    return;
  }

  const width = element.clientWidth || element.offsetWidth;

  if (width <= 0) {
    isOverflow.value = false;
    return;
  }

  if (element.scrollWidth - width > 1) {
    isOverflow.value = true;
    return;
  }

  const range = element.ownerDocument?.createRange();

  if (!range || element.childNodes.length === 0) {
    isOverflow.value = false;
    return;
  }

  try {
    range.selectNodeContents(element);
    const textWidth = Math.ceil(range.getBoundingClientRect().width);
    const elementWidth = Math.ceil(element.getBoundingClientRect().width || width);
    const computedStyle = getComputedStyle(element);
    const paddingWidth =
      Number.parseFloat(computedStyle.paddingLeft || "0") +
      Number.parseFloat(computedStyle.paddingRight || "0");

    isOverflow.value = textWidth > elementWidth - paddingWidth + 1;
  } finally {
    range.detach?.();
  }
}

onMounted(() => {
  syncOverflow();
});
watch(
  () => [normalizedContent.value, normalizedTooltipContent.value],
  () => {
    syncOverflow();
  },
  {
    flush: "post"
  }
);
</script>

<template>
  <xy-tooltip v-if="hasTooltip" v-bind="tooltipBindings">
    <span ref="textRef" :class="textClass">{{ normalizedContent }}</span>
  </xy-tooltip>
  <span v-else ref="textRef" :class="textClass">{{ normalizedContent }}</span>
</template>
