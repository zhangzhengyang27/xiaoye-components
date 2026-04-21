<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import type { SliderProps } from "./slider";

const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  size: "md",
  disabled: false,
  showInput: false,
  showStops: false,
  range: false,
  vertical: false,
  height: "200px"
});

const emit = defineEmits<{
  "update:modelValue": [value: number | [number, number]];
  change: [value: number | [number, number]];
}>();

const ns = "xyu-slider";
const trackRef = ref<HTMLElement | null>(null);
const dragging = ref(false);
const activeThumb = ref(0);

const localMin = computed(() => (props.modelValue as [number, number])?.[0] ?? (props.range ? props.min : (props.modelValue as number)));
const localMax = computed(() => (props.modelValue as [number, number])?.[1] ?? (props.modelValue as number));

const rangeStart = computed(() => {
  return ((localMin.value - props.min) / (props.max - props.min)) * 100;
});

const rangeEnd = computed(() => {
  return ((localMax.value - props.min) / (props.max - props.min)) * 100;
});

const stopPoints = computed(() => {
  if (!props.showStops) return [];
  const stops: number[] = [];
  const stepCount = Math.floor((props.max - props.min) / props.step);
  for (let i = 1; i < stepCount; i++) {
    stops.push((i / stepCount) * 100);
  }
  return stops;
});

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

function getValueFromPosition(clientX: number, clientY: number): number {
  if (!trackRef.value) return props.min;
  const rect = trackRef.value.getBoundingClientRect();
  let ratio: number;
  if (props.vertical) {
    ratio = (rect.bottom - clientY) / rect.height;
  } else {
    ratio = (clientX - rect.left) / rect.width;
  }
  ratio = clamp(ratio, 0, 1);
  const raw = props.min + ratio * (props.max - props.min);
  const steps = Math.round((raw - props.min) / props.step);
  return clamp(props.min + steps * props.step, props.min, props.max);
}

function updateValue(val: number) {
  if (props.range) {
    const cur = props.modelValue as [number, number] ?? [props.min, props.max];
    let newVal: [number, number];
    if (activeThumb.value === 0) {
      newVal = [Math.min(val, cur[1] - props.step), cur[1]];
    } else {
      newVal = [cur[0], Math.max(val, cur[0] + props.step)];
    }
    emit("update:modelValue", newVal);
  } else {
    emit("update:modelValue", val);
  }
}

function onTrackClick(e: MouseEvent) {
  if (props.disabled || dragging.value) return;
  const val = getValueFromPosition(e.clientX, e.clientY);
  if (props.range) {
    const cur = props.modelValue as [number, number];
    const mid = (cur[0] + cur[1]) / 2;
    activeThumb.value = val < mid ? 0 : 1;
  }
  updateValue(val);
}

function onMouseDown(e: MouseEvent, thumbIndex: number) {
  if (props.disabled) return;
  e.preventDefault();
  activeThumb.value = thumbIndex;
  dragging.value = true;
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(e: MouseEvent) {
  if (!dragging.value) return;
  const val = getValueFromPosition(e.clientX, e.clientY);
  updateValue(val);
}

function onMouseUp() {
  dragging.value = false;
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  emit("change", props.modelValue);
}

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
});
</script>

<template>
  <div :class="[ns, `${ns}--${props.size}`, props.disabled ? 'is-disabled' : '', props.vertical ? 'is-vertical' : '']">
    <div
      v-if="props.showInput && !props.range"
      :class="`${ns}__input`"
    >
      <input
        type="number"
        :value="localMax"
        :min="props.min"
        :max="props.max"
        :disabled="props.disabled"
        :class="`${ns}__input-inner`"
        @change="(e: Event) => {
          const val = Number((e.target as HTMLInputElement).value);
          emit('update:modelValue', Math.max(props.min, Math.min(props.max, val)));
        }"
      />
    </div>

    <div
      :class="`${ns}__body`"
      :style="props.vertical ? { height: props.height } : {}"
    >
      <div
        :ref="(el) => { trackRef = el as HTMLElement; }"
        :class="`${ns}__track`"
        @click="onTrackClick"
      >
        <!-- 轨道背景 -->
        <div :class="`${ns}__bar`" />

        <!-- 范围轨道 -->
        <div
          v-if="props.range"
          :class="`${ns}__range`"
          :style="props.vertical
            ? { bottom: `${rangeStart}%`, height: `${rangeEnd - rangeStart}%` }
            : { left: `${rangeStart}%`, width: `${rangeEnd - rangeStart}%` }"
        />

        <!-- stops -->
        <div
          v-for="(pos, idx) in stopPoints"
          :key="idx"
          :class="`${ns}__stop`"
          :style="props.vertical ? { bottom: `${pos}%` } : { left: `${pos}%` }"
        />

        <!-- 滑块 -->
        <div
          v-if="props.range"
          :class="[`${ns}__thumb`, dragging && activeThumb === 0 ? 'is-active' : '']"
          :style="props.vertical
            ? { bottom: `${rangeStart}%` }
            : { left: `${rangeStart}%` }"
          @mousedown="(e: MouseEvent) => onMouseDown(e, 0)"
        />
        <div
          :class="[`${ns}__thumb`, dragging && activeThumb === (props.range ? 1 : 0) ? 'is-active' : '']"
          :style="props.vertical
            ? { bottom: `${props.range ? rangeEnd : rangeStart}%` }
            : { left: `${props.range ? rangeEnd : rangeStart}%` }"
          @mousedown="(e: MouseEvent) => onMouseDown(e, props.range ? 1 : 0)"
        />
      </div>
    </div>
  </div>
</template>
