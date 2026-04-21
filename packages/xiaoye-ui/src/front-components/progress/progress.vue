<script setup lang="ts">
import { computed } from "vue";
import type { ProgressProps } from "./progress";

defineOptions({ name: "XyuProgress" });

const props = withDefaults(defineProps<ProgressProps>(), {
  type: "line",
  percentage: 0,
  strokeWidth: 8,
  width: 126,
  size: "default",
  showText: true,
  striped: false,
  stripedFlow: false,
  indeterminate: false
});

const ns = "xyu-progress";

const clampedPercentage = computed(() =>
  Math.max(0, Math.min(100, props.percentage))
);

const barStyle = computed(() => {
  const styles: Record<string, string> = {};
  if (props.type === "line") {
    styles.height = `${props.strokeWidth}px`;
    styles.borderRadius = "var(--xyu-radius-pill)";
  }
  return styles;
});

const displayText = computed(() => {
  if (props.format) return props.format(clampedPercentage.value);
  return `${clampedPercentage.value}%`;
});

const progressClasses = computed(() => [
  ns,
  `${ns}--${props.type}`,
  `${ns}--${props.size}`,
  props.status ? `is-${props.status}` : "",
  !props.showText ? "is-without-text" : "",
  props.striped ? "is-striped" : ""
]);

const innerClasses = computed(() => [
  `${ns}__bar-inner`,
  props.indeterminate ? `${ns}__bar-inner--indeterminate` : "",
  props.striped && props.stripedFlow ? `${ns}__bar-inner--striped-flow` : "",
  props.striped && !props.stripedFlow ? `${ns}__bar-inner--striped` : ""
]);

// Circle / dashboard
const circleSize = computed(() =>
  typeof props.width === "number" ? props.width : parseInt(props.width as string, 10)
);

const circleStyle = computed(() => ({
  width: `${circleSize.value}px`,
  height: `${circleSize.value}px`
}));

const normalizedStrokeWidth = computed(() => {
  if (props.type === "line") return props.strokeWidth;
  return props.strokeWidth ?? 6;
});

const radius = computed(() => {
  const sw = normalizedStrokeWidth.value;
  if (props.type === "circle") {
    return (circleSize.value - sw) / 2;
  }
  // dashboard
  return (circleSize.value - sw) / 2;
});

const perimeter = computed(() => 2 * Math.PI * radius.value);

const relativeStrokeProgress = computed(() => {
  const p = clampedPercentage.value;
  return (p / 100) * perimeter.value;
});

const viewBox = computed(() => {
  const s = circleSize.value;
  return `0 0 ${s} ${s}`;
});

const cx = computed(() => circleSize.value / 2);
const cy = computed(() => circleSize.value / 2);

const strokeDasharray = computed(() => {
  if (props.type === "circle") {
    return `${relativeStrokeProgress.value} ${perimeter.value}`;
  }
  // dashboard: gap
  const gap = perimeter.value * 0.25;
  const arc = relativeStrokeProgress.value;
  return `${arc} ${perimeter.value - arc + gap}`;
});

const strokeDashoffset = computed(() => {
  if (props.type === "circle") return "0";
  // dashboard: start from top, offset
  return `${perimeter.value * 0.25}`;
});
</script>

<template>
  <div :class="progressClasses">
    <!-- Line -->
    <template v-if="props.type === 'line'">
      <div :class="`${ns}__bar`">
        <div :class="`${ns}__bar-outer`" :style="barStyle">
          <div
            :class="innerClasses"
            :style="{
              width: props.indeterminate ? '42%' : `${clampedPercentage}%`
            }"
          >
            <span v-if="props.showText && !props.indeterminate" :class="`${ns}__bar-inner-text`">
              <slot>{{ displayText }}</slot>
            </span>
          </div>
        </div>
      </div>
      <span v-if="props.showText" :class="`${ns}__text`">
        <slot name="text">{{ displayText }}</slot>
      </span>
    </template>

    <!-- Circle / Dashboard -->
    <template v-else>
      <div :class="`${ns}__circle`" :style="circleStyle">
        <svg :viewBox="viewBox">
          <circle
            :class="`${ns}__circle-track`"
            :cx="cx"
            :cy="cy"
            :r="radius"
            fill="none"
            :stroke-width="normalizedStrokeWidth"
          />
          <circle
            :class="`${ns}__circle-path`"
            :cx="cx"
            :cy="cy"
            :r="radius"
            fill="none"
            :stroke="props.strokeColor || 'var(--xyu-primary)'"
            :stroke-width="normalizedStrokeWidth"
            :stroke-dasharray="strokeDasharray"
            :stroke-dashoffset="strokeDashoffset"
            :stroke-linecap="props.type === 'circle' ? 'butt' : 'round'"
          />
        </svg>
        <span v-if="props.showText" :class="`${ns}__text`">
          <slot>{{ displayText }}</slot>
        </span>
      </div>
    </template>
  </div>
</template>
