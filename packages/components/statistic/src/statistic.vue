<script setup lang="ts">
defineOptions({
  name: "XyStatistic",
  inheritAttrs: false
});

import { computed, useAttrs } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { StatisticProps } from "./statistic";

const props = withDefaults(defineProps<StatisticProps>(), {
  value: 0,
  title: "",
  prefix: "",
  suffix: "",
  precision: 0,
  decimalSeparator: ".",
  groupSeparator: ",",
  formatter: undefined,
  valueStyle: undefined
});

const slots = defineSlots<{
  title?: () => unknown;
  prefix?: () => unknown;
  suffix?: () => unknown;
}>();

const attrs = useAttrs();
const ns = useNamespace("statistic");

const nativeAttrs = computed<Record<string, unknown>>(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  return rest;
});

const hasTitle = computed(() => Boolean(slots.title) || props.title !== "");
const hasPrefix = computed(() => Boolean(slots.prefix) || props.prefix !== "");
const hasSuffix = computed(() => Boolean(slots.suffix) || props.suffix !== "");

const rootClasses = computed(() => [ns.base.value, attrs.class]);

const displayValue = computed(() => {
  if (props.formatter) {
    return props.formatter(props.value);
  }

  if (typeof props.value !== "number" || Number.isNaN(props.value) || !Number.isFinite(props.value)) {
    return props.value;
  }

  const normalizedPrecision = normalizePrecision(props.precision);
  const [integerPart, decimalPart = ""] = props.value
    .toFixed(normalizedPrecision)
    .split(".");

  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator);

  if (!decimalPart) {
    return groupedInteger;
  }

  return `${groupedInteger}${props.decimalSeparator}${decimalPart}`;
});

function normalizePrecision(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}

defineExpose({
  displayValue
});
</script>

<template>
  <div :class="rootClasses" :style="attrs.style" v-bind="nativeAttrs">
    <div v-if="hasTitle" class="xy-statistic__head">
      <slot name="title">
        {{ props.title }}
      </slot>
    </div>

    <div class="xy-statistic__content">
      <span v-if="hasPrefix" class="xy-statistic__prefix">
        <slot name="prefix">
          {{ props.prefix }}
        </slot>
      </span>

      <span class="xy-statistic__value" :style="props.valueStyle">
        {{ displayValue }}
      </span>

      <span v-if="hasSuffix" class="xy-statistic__suffix">
        <slot name="suffix">
          {{ props.suffix }}
        </slot>
      </span>
    </div>
  </div>
</template>
