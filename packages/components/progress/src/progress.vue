<script setup lang="ts">
defineOptions({
  name: "XyProgress",
  inheritAttrs: false
});

import { computed, useAttrs } from "vue";
import type { CSSProperties } from "vue";
import { useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import type {
  ProgressColorMap,
  ProgressColorStop,
  ProgressProps,
  ProgressStatus
} from "./progress";

const STATUS_COLOR_MAP: Record<Exclude<ProgressStatus, ""> | "default", string> = {
  success: "var(--xy-color-success)",
  exception: "var(--xy-color-danger)",
  warning: "var(--xy-color-warning)",
  default: "var(--xy-color-primary)"
};

const props = withDefaults(defineProps<ProgressProps>(), {
  type: "line",
  percentage: 0,
  status: "",
  indeterminate: false,
  duration: 3,
  strokeWidth: 6,
  strokeLinecap: "round",
  textInside: false,
  width: 126,
  showText: true,
  color: "",
  striped: false,
  stripedFlow: false,
  format: (percentage: number) => `${percentage}%`
});

const slots = defineSlots<{
  default?: (props: { percentage: number; content: string; status: ProgressStatus }) => unknown;
}>();

const attrs = useAttrs();
const ns = useNamespace("progress");

const nativeAttrs = computed<Record<string, unknown>>(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  return rest;
});

const isLine = computed(() => props.type === "line");
const hasContentSlot = computed(() => Boolean(slots.default));
const normalizedPercentage = computed(() => clampPercentage(props.percentage));
const normalizedDuration = computed(() => normalizePositiveNumber(props.duration, 3));
const normalizedStrokeWidth = computed(() => normalizePositiveNumber(props.strokeWidth, 6));
const normalizedWidth = computed(() =>
  Math.max(normalizePositiveNumber(props.width, 126), normalizedStrokeWidth.value + 1)
);
const showContent = computed(() => props.showText || hasContentSlot.value);
const showInnerText = computed(() => isLine.value && props.textInside && showContent.value);
const showOuterText = computed(() => showContent.value && !showInnerText.value);

const rootKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.type}`,
  {
    [`${ns.base.value}--without-text`]: !showContent.value,
    [`${ns.base.value}--text-inside`]: isLine.value && props.textInside
  },
  ns.is(props.status, Boolean(props.status)),
  attrs.class
]);

const currentColor = computed(() => {
  if (props.color) {
    return getCurrentColor(normalizedPercentage.value, props.color);
  }

  return STATUS_COLOR_MAP[props.status || "default"];
});

const barStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    width: props.indeterminate ? "42%" : `${normalizedPercentage.value}%`,
    animationDuration: `${normalizedDuration.value}s`
  };

  const color = currentColor.value;

  if (/gradient/i.test(color)) {
    style.background = color;
  } else {
    style.backgroundColor = color;
  }

  return style;
});

const progressTextSize = computed(() =>
  isLine.value ? 12 + normalizedStrokeWidth.value * 0.36 : normalizedWidth.value * 0.111111 + 2
);

const content = computed(() => props.format(normalizedPercentage.value));

const relativeStrokeWidth = computed(() =>
  Math.min(100, (normalizedStrokeWidth.value / normalizedWidth.value) * 100).toFixed(1)
);

const radius = computed(() => {
  if (!isLine.value) {
    return Math.max(0, Number.parseInt(`${50 - Number.parseFloat(relativeStrokeWidth.value) / 2}`, 10));
  }

  return 0;
});

const trackPath = computed(() => {
  const currentRadius = radius.value;
  const isDashboard = props.type === "dashboard";

  return `
    M 50 50
    m 0 ${isDashboard ? "" : "-"}${currentRadius}
    a ${currentRadius} ${currentRadius} 0 1 1 0 ${isDashboard ? "-" : ""}${currentRadius * 2}
    a ${currentRadius} ${currentRadius} 0 1 1 0 ${isDashboard ? "" : "-"}${currentRadius * 2}
  `;
});

const perimeter = computed(() => 2 * Math.PI * radius.value);
const rate = computed(() => (props.type === "dashboard" ? 0.75 : 1));
const strokeDashoffset = computed(() => `${(-1 * perimeter.value * (1 - rate.value)) / 2}px`);

const trailPathStyle = computed<CSSProperties>(() => ({
  strokeDasharray: `${perimeter.value * rate.value}px, ${perimeter.value}px`,
  strokeDashoffset: strokeDashoffset.value
}));

const circlePathStyle = computed<CSSProperties>(() => ({
  strokeDasharray: `${perimeter.value * rate.value * (normalizedPercentage.value / 100)}px, ${perimeter.value}px`,
  strokeDashoffset: strokeDashoffset.value
}));

const stroke = computed(() => currentColor.value);

const statusIcon = computed(() => {
  if (props.status === "warning") {
    return props.type === "line" ? "mdi:alert-circle" : "mdi:alert";
  }

  if (props.status === "success") {
    return props.type === "line" ? "mdi:check-circle" : "mdi:check";
  }

  if (props.status === "exception") {
    return props.type === "line" ? "mdi:close-circle" : "mdi:close";
  }

  return "";
});

function clampPercentage(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

function normalizePositiveNumber(value: number | null | undefined, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return value;
}

function isColorStop(value: string | ProgressColorStop): value is ProgressColorStop {
  return typeof value === "object" && value !== null && "color" in value;
}

function getColors(color: ProgressColorMap) {
  const span = color.length > 0 ? 100 / color.length : 0;

  return color
    .map((item, index) =>
      isColorStop(item)
        ? item
        : {
            color: item,
            percentage: span * (index + 1)
          }
    )
    .sort((a, b) => a.percentage - b.percentage);
}

function getCurrentColor(percentage: number, color: ProgressProps["color"]) {
  if (typeof color === "function") {
    return color(percentage);
  }

  if (typeof color === "string") {
    return color;
  }

  const colors = getColors(color ?? []);

  for (const item of colors) {
    if (item.percentage > percentage) {
      return item.color;
    }
  }

  return colors.at(-1)?.color ?? STATUS_COLOR_MAP.default;
}
</script>

<template>
  <div
    :class="rootKls"
    :style="attrs.style"
    role="progressbar"
    :aria-valuenow="props.indeterminate ? undefined : normalizedPercentage"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-busy="props.indeterminate || undefined"
    :aria-valuetext="props.indeterminate ? undefined : content"
    v-bind="nativeAttrs"
  >
    <div v-if="isLine" :class="`${ns.base.value}__bar`">
      <div
        :class="`${ns.base.value}__bar-outer`"
        :style="{ height: `${normalizedStrokeWidth}px` }"
      >
        <div
          :class="[
            `${ns.base.value}__bar-inner`,
            {
              [`${ns.base.value}__bar-inner--indeterminate`]: props.indeterminate,
              [`${ns.base.value}__bar-inner--striped`]: props.striped || props.stripedFlow,
              [`${ns.base.value}__bar-inner--striped-flow`]: props.stripedFlow
            }
          ]"
          :style="barStyle"
        >
          <div
            v-if="showInnerText"
            :class="`${ns.base.value}__bar-inner-text`"
            :style="{ fontSize: `${Math.max(12, normalizedStrokeWidth * 0.9)}px` }"
          >
            <slot
              :percentage="normalizedPercentage"
              :content="content"
              :status="props.status"
            >
              <span>{{ content }}</span>
            </slot>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      :class="`${ns.base.value}__circle`"
      :style="{ width: `${normalizedWidth}px`, height: `${normalizedWidth}px` }"
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path
          :class="`${ns.base.value}__circle-track`"
          :d="trackPath"
          :stroke-linecap="props.strokeLinecap"
          :stroke-width="relativeStrokeWidth"
          fill="none"
          :style="trailPathStyle"
        />
        <path
          :class="`${ns.base.value}__circle-path`"
          :d="trackPath"
          :stroke="stroke"
          fill="none"
          :opacity="normalizedPercentage ? 1 : 0"
          :stroke-linecap="props.strokeLinecap"
          :stroke-width="relativeStrokeWidth"
          :style="circlePathStyle"
        />
      </svg>
    </div>

    <div
      v-if="showOuterText"
      :class="`${ns.base.value}__text`"
      :style="{ fontSize: `${progressTextSize}px` }"
    >
      <slot
        :percentage="normalizedPercentage"
        :content="content"
        :status="props.status"
      >
        <span v-if="!props.status">{{ content }}</span>
        <XyIcon
          v-else
          :class="`${ns.base.value}__text-icon`"
          :icon="statusIcon"
          :size="Math.max(14, progressTextSize)"
        />
      </slot>
    </div>
  </div>
</template>
