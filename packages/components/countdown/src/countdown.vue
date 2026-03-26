<script setup lang="ts">
defineOptions({
  name: "XyCountdown",
  inheritAttrs: false
});

import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue";
import XyStatistic from "../../statistic";
import type { CountdownProps } from "./countdown";
import { formatCountdownTime, resolveCountdownValue } from "./utils";

const props = withDefaults(defineProps<CountdownProps>(), {
  value: 0,
  format: "HH:mm:ss",
  title: "",
  prefix: "",
  suffix: "",
  valueStyle: undefined
});

const emit = defineEmits<{
  (event: "change", value: number): void;
  (event: "finish"): void;
}>();

const slots = defineSlots<{
  title?: () => unknown;
  prefix?: () => unknown;
  suffix?: () => unknown;
}>();

const attrs = useAttrs();

const rawValue = ref(0);
const displayValue = computed(() => formatCountdownTime(rawValue.value, props.format));

let timer: number | undefined;
let finished = false;

function formatValue(value: number | string) {
  return typeof value === "number" ? formatCountdownTime(value, props.format) : String(value);
}

function requestFrame(callback: FrameRequestCallback) {
  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    return window.requestAnimationFrame(callback);
  }

  return window.setTimeout(() => callback(Date.now()), 16);
}

function cancelFrame(id: number) {
  if (typeof window !== "undefined" && typeof window.cancelAnimationFrame === "function") {
    window.cancelAnimationFrame(id);
    return;
  }

  window.clearTimeout(id);
}

function stopTimer() {
  if (timer !== undefined) {
    cancelFrame(timer);
    timer = undefined;
  }
}

function startTimer() {
  stopTimer();
  finished = false;

  const targetTime = resolveCountdownValue(props.value);

  const update = () => {
    const nextValue = Math.max(targetTime - Date.now(), 0);

    rawValue.value = nextValue;
    emit("change", nextValue);

    if (nextValue <= 0) {
      stopTimer();

      if (!finished) {
        finished = true;
        emit("finish");
      }

      return;
    }

    timer = requestFrame(update);
  };

  update();
}

onMounted(() => {
  watch(
    () => [props.value, props.format] as const,
    () => {
      startTimer();
    },
    {
      immediate: true
    }
  );
});

onBeforeUnmount(() => {
  stopTimer();
});

defineExpose({
  displayValue
});
</script>

<template>
  <XyStatistic
    class="xy-countdown"
    v-bind="attrs"
    :value="rawValue"
    :title="props.title"
    :prefix="props.prefix"
    :suffix="props.suffix"
    :value-style="props.valueStyle"
    :formatter="formatValue"
  >
    <template v-if="slots.title" #title>
      <slot name="title" />
    </template>

    <template v-if="slots.prefix" #prefix>
      <slot name="prefix" />
    </template>

    <template v-if="slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
  </XyStatistic>
</template>
