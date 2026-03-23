<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});

import { computed, inject, nextTick, onBeforeUnmount, ref, shallowRef, useAttrs, watch } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyInputNumber from "../../input-number";
import { formItemKey } from "../../form/src/context";
import type { SliderProps, SliderValue } from "./slider";

type ThumbName = "start" | "end";

const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: 0,
  id: undefined,
  min: 0,
  max: 100,
  step: 1,
  showInput: false,
  showInputControls: true,
  size: undefined,
  inputSize: undefined,
  showStops: false,
  showTooltip: true,
  formatTooltip: undefined,
  disabled: false,
  range: false,
  vertical: false,
  height: "180px",
  rangeStartLabel: "起始值",
  rangeEndLabel: "结束值",
  formatValueText: undefined,
  tooltipClass: "",
  placement: "top",
  validateEvent: true,
  persistent: true,
  ariaLabel: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: SliderValue];
  input: [value: SliderValue];
  change: [value: SliderValue];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const attrs = useAttrs();
const formItem = inject(formItemKey, null);
const ns = useNamespace("slider");
const { size: globalSize } = useConfig();

const rootRef = shallowRef<HTMLElement | null>(null);
const runwayRef = shallowRef<HTMLElement | null>(null);
const startThumbRef = shallowRef<HTMLElement | null>(null);
const endThumbRef = shallowRef<HTMLElement | null>(null);

const startValue = ref(props.min);
const endValue = ref(props.max);
const draggingThumb = ref<ThumbName | null>(null);
const focusedThumb = ref<ThumbName | null>(null);
const hoveredThumb = ref<ThumbName | null>(null);
const dragStartPayload = ref<SliderValue>(0);
let validateTimer: number | null = null;

const mergedSize = computed(() => props.size ?? globalSize.value);
const mergedInputSize = computed(() => props.inputSize ?? mergedSize.value);
const inputId = computed(() => props.id ?? formItem?.inputId);
const messageId = computed(() => (formItem?.message.value ? formItem.messageId : undefined));
const validateState = computed(() => formItem?.validateState.value ?? "idle");
const renderInput = computed(() => props.showInput && !props.range);

const rootKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${mergedSize.value}`,
  ns.is("vertical", props.vertical),
  ns.is("range", props.range),
  ns.is("with-input", renderInput.value),
  ns.is("with-tooltip", props.showTooltip),
  ns.is("disabled", props.disabled),
  attrs.class
]);

const nativeAttrs = computed<Record<string, unknown>>(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  return rest;
});

const precision = computed(() => {
  const values = [props.min, props.max, props.step];
  return values.reduce((maxDigits, value) => {
    const decimal = `${value}`.split(".")[1];
    return Math.max(maxDigits, decimal ? decimal.length : 0);
  }, 0);
});

const barStyle = computed(() => {
  const minPosition = Math.min(getPercent(startValue.value), getPercent(endValue.value));
  const maxPosition = Math.max(getPercent(startValue.value), getPercent(endValue.value));

  if (props.vertical) {
    return {
      bottom: `${minPosition}%`,
      height: `${props.range ? maxPosition - minPosition : maxPosition}%`
    };
  }

  return {
    left: props.range ? `${minPosition}%` : "0%",
    width: `${props.range ? maxPosition - minPosition : maxPosition}%`
  };
});

const runwayStyle = computed(() =>
  props.vertical ? { height: props.height || "180px" } : undefined
);

const stopList = computed(() => {
  if (!props.showStops || props.step <= 0) {
    return [];
  }

  const result: number[] = [];
  const minSelected = Math.min(startValue.value, endValue.value);
  const maxSelected = Math.max(startValue.value, endValue.value);
  let cursor = roundToPrecision(props.min + props.step);

  while (cursor < props.max) {
    const hidden = props.range
      ? cursor > minSelected && cursor < maxSelected
      : cursor <= startValue.value;

    if (!hidden) {
      result.push(getPercent(cursor));
    }

    cursor = roundToPrecision(cursor + props.step);
  }

  return result;
});

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && !Number.isNaN(value);
}

function roundToPrecision(value: number) {
  return Number.parseFloat(value.toFixed(precision.value));
}

function clampValue(value: number, lower = props.min, upper = props.max) {
  return Math.min(upper, Math.max(lower, value));
}

function getPercent(value: number) {
  if (props.max === props.min) {
    return 0;
  }

  return ((value - props.min) / (props.max - props.min)) * 100;
}

function getTooltipContent(value: number) {
  const formatted = props.formatTooltip?.(value) ?? value;
  return String(formatted);
}

function getValueText(value: number) {
  return props.formatValueText?.(value) ?? String(value);
}

function getCurrentPayload(): SliderValue {
  return props.range ? [startValue.value, endValue.value] : startValue.value;
}

function clonePayload(value: SliderValue): SliderValue {
  return Array.isArray(value) ? [value[0], value[1]] : value;
}

function isSamePayload(a: SliderValue, b: SliderValue) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a[0] === b[0] && a[1] === b[1];
  }

  return !Array.isArray(a) && !Array.isArray(b) && a === b;
}

function normalizeValue(value: number, lower = props.min, upper = props.max) {
  if (props.max <= props.min) {
    return props.min;
  }

  const clamped = clampValue(value, lower, upper);

  if (props.step <= 0) {
    return roundToPrecision(clamped);
  }

  const steps = Math.round((clamped - props.min) / props.step);
  const next = props.min + steps * props.step;
  return clampValue(roundToPrecision(next), lower, upper);
}

function normalizeRangeValue(value: SliderValue) {
  const values = Array.isArray(value) ? value : [props.min, props.min];
  let nextStart = normalizeValue(isNumber(values[0]) ? values[0] : props.min);
  let nextEnd = normalizeValue(isNumber(values[1]) ? values[1] : nextStart);

  if (nextStart > nextEnd) {
    [nextStart, nextEnd] = [nextEnd, nextStart];
  }

  return [nextStart, nextEnd] as [number, number];
}

function syncFromModel() {
  if (props.range) {
    const [nextStart, nextEnd] = normalizeRangeValue(props.modelValue);
    startValue.value = nextStart;
    endValue.value = nextEnd;
    return;
  }

  const nextValue = Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue;
  startValue.value = normalizeValue(isNumber(nextValue) ? nextValue : props.min);
  endValue.value = props.max;
}

function clearStaleValidation() {
  if (formItem?.validateState.value === "error") {
    formItem.clearValidate();
  }
}

function emitUpdatedValue() {
  const payload = clonePayload(getCurrentPayload());
  clearStaleValidation();
  emit("update:modelValue", payload);
  emit("input", payload);
}

function emitCommittedValue(previous: SliderValue) {
  const payload = clonePayload(getCurrentPayload());
  const changed = !isSamePayload(payload, previous);

  if (changed) {
    emit("change", payload);
  }

  if (props.validateEvent && changed) {
    if (validateTimer !== null) {
      window.clearTimeout(validateTimer);
    }

    validateTimer = window.setTimeout(() => {
      validateTimer = null;
      void formItem?.validate("change");
    }, 0);
  }
}

function updateThumbValue(thumb: ThumbName, value: number, emitUpdate = true) {
  if (props.disabled) {
    return false;
  }

  const previous = clonePayload(getCurrentPayload());

  if (thumb === "start") {
    startValue.value = normalizeValue(value, props.min, props.range ? endValue.value : props.max);
  } else {
    endValue.value = normalizeValue(value, startValue.value, props.max);
  }

  const next = getCurrentPayload();
  const changed = !isSamePayload(previous, next);

  if (changed && emitUpdate) {
    emitUpdatedValue();
  }

  return changed;
}

function getEventClient(event: MouseEvent | TouchEvent) {
  if ("touches" in event) {
    const touch = event.touches[0] ?? event.changedTouches[0];
    return {
      x: touch?.clientX ?? 0,
      y: touch?.clientY ?? 0
    };
  }

  return {
    x: event.clientX,
    y: event.clientY
  };
}

function getPointerValue(event: MouseEvent | TouchEvent) {
  const runway = runwayRef.value;

  if (!runway) {
    return props.min;
  }

  const rect = runway.getBoundingClientRect();
  const point = getEventClient(event);
  const ratio = props.vertical
    ? (rect.bottom - point.y) / rect.height
    : (point.x - rect.left) / rect.width;
  const percent = Math.min(1, Math.max(0, ratio));

  return props.min + percent * (props.max - props.min);
}

function getNearestThumb(value: number): ThumbName {
  if (!props.range) {
    return "start";
  }

  const startDistance = Math.abs(value - startValue.value);
  const endDistance = Math.abs(value - endValue.value);

  return startDistance <= endDistance ? "start" : "end";
}

function isTooltipVisible(thumb: ThumbName) {
  return props.showTooltip && (
    draggingThumb.value === thumb ||
    focusedThumb.value === thumb ||
    hoveredThumb.value === thumb
  );
}

function getThumbStyle(thumb: ThumbName) {
  const value = thumb === "start" ? startValue.value : endValue.value;
  const percent = getPercent(value);

  return props.vertical ? { bottom: `${percent}%` } : { left: `${percent}%` };
}

function getStopStyle(position: number) {
  return props.vertical ? { bottom: `${position}%` } : { left: `${position}%` };
}

function focusThumb(thumb: ThumbName) {
  (thumb === "start" ? startThumbRef.value : endThumbRef.value)?.focus();
}

function handleThumbFocus(thumb: ThumbName, event: FocusEvent) {
  focusedThumb.value = thumb;
  emit("focus", event);
}

function handleThumbBlur(thumb: ThumbName, event: FocusEvent) {
  if (focusedThumb.value === thumb) {
    focusedThumb.value = null;
  }

  emit("blur", event);

  if (props.validateEvent) {
    void nextTick(() => formItem?.validate("blur"));
  }
}

function handleThumbHover(thumb: ThumbName, hovering: boolean) {
  hoveredThumb.value = hovering ? thumb : hoveredThumb.value === thumb ? null : hoveredThumb.value;
}

function moveByKeyboard(thumb: ThumbName, event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  const previous = clonePayload(getCurrentPayload());
  const lower = thumb === "end" ? startValue.value : props.min;
  const upper = thumb === "start" && props.range ? endValue.value : props.max;
  const current = thumb === "start" ? startValue.value : endValue.value;

  let next = current;

  const step = props.step;

  switch (event.key) {
    case "ArrowLeft":
    case "ArrowDown":
      next = current - step;
      break;
    case "ArrowRight":
    case "ArrowUp":
      next = current + step;
      break;
    case "PageDown":
      next = current - step * 4;
      break;
    case "PageUp":
      next = current + step * 4;
      break;
    case "Home":
      next = lower;
      break;
    case "End":
      next = upper;
      break;
    default:
      return;
  }

  event.preventDefault();
  event.stopPropagation();

  const changed = updateThumbValue(thumb, next, true);

  if (changed) {
    emitCommittedValue(previous);
  }
}

function removeDragListeners() {
  window.removeEventListener("mousemove", onWindowMouseMove);
  window.removeEventListener("mouseup", onWindowMouseUp);
  window.removeEventListener("touchmove", onWindowTouchMove);
  window.removeEventListener("touchend", onWindowTouchEnd);
  window.removeEventListener("touchcancel", onWindowTouchEnd);
}

function finishDragging() {
  if (!draggingThumb.value) {
    return;
  }

  const previous = clonePayload(dragStartPayload.value);
  draggingThumb.value = null;
  removeDragListeners();
  emitCommittedValue(previous);
}

function startDragging(thumb: ThumbName) {
  dragStartPayload.value = clonePayload(getCurrentPayload());
  draggingThumb.value = thumb;
  focusThumb(thumb);
  removeDragListeners();
  window.addEventListener("mousemove", onWindowMouseMove);
  window.addEventListener("mouseup", onWindowMouseUp);
  window.addEventListener("touchmove", onWindowTouchMove, { passive: false });
  window.addEventListener("touchend", onWindowTouchEnd);
  window.addEventListener("touchcancel", onWindowTouchEnd);
}

function handleThumbPointerDown(thumb: ThumbName, event: MouseEvent | TouchEvent) {
  if (props.disabled) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  startDragging(thumb);
}

function handleRunwayPointerDown(event: MouseEvent | TouchEvent) {
  if (props.disabled) {
    return;
  }

  event.preventDefault();

  const nextValue = getPointerValue(event);
  const thumb = getNearestThumb(nextValue);

  updateThumbValue(thumb, nextValue, true);
  startDragging(thumb);
}

function handleInputValue(value: number | null) {
  updateThumbValue("start", value ?? props.min, true);
}

function handleInputChange() {
  emitCommittedValue(clonePayload(props.modelValue));
}

function onWindowMouseMove(event: MouseEvent) {
  if (!draggingThumb.value) {
    return;
  }

  event.preventDefault();
  updateThumbValue(draggingThumb.value, getPointerValue(event), true);
}

function onWindowMouseUp() {
  finishDragging();
}

function onWindowTouchMove(event: TouchEvent) {
  if (!draggingThumb.value) {
    return;
  }

  event.preventDefault();
  updateThumbValue(draggingThumb.value, getPointerValue(event), true);
}

function onWindowTouchEnd() {
  finishDragging();
}

function focus() {
  focusThumb("start");
}

function blur() {
  startThumbRef.value?.blur();
  endThumbRef.value?.blur();
}

watch(
  () => [props.modelValue, props.min, props.max, props.range, props.step],
  () => {
    if (!draggingThumb.value) {
      syncFromModel();
    }
  },
  {
    deep: true,
    immediate: true
  }
);

onBeforeUnmount(() => {
  if (validateTimer !== null) {
    window.clearTimeout(validateTimer);
    validateTimer = null;
  }

  removeDragListeners();
});

defineExpose({
  focus,
  blur
});
</script>

<template>
  <div
    :id="props.range ? inputId : undefined"
    ref="rootRef"
    :class="rootKls"
    :style="attrs.style"
    :role="props.range ? 'group' : undefined"
    v-bind="nativeAttrs"
  >
    <div
      ref="runwayRef"
      class="xy-slider__runway"
      :class="ns.is('disabled', props.disabled)"
      :style="runwayStyle"
      @mousedown="handleRunwayPointerDown"
      @touchstart="handleRunwayPointerDown"
    >
      <div class="xy-slider__bar" :style="barStyle" />

      <div
        :id="!props.range ? inputId : undefined"
        ref="startThumbRef"
        class="xy-slider__thumb-wrapper"
        :class="[
          ns.is('dragging', draggingThumb === 'start'),
          ns.is('focused', focusedThumb === 'start'),
          ns.is('hover', hoveredThumb === 'start')
        ]"
        :style="getThumbStyle('start')"
        role="slider"
        :tabindex="props.disabled ? undefined : 0"
        :aria-label="props.range ? props.rangeStartLabel : props.ariaLabel ?? '滑块'"
        :aria-valuemin="props.min"
        :aria-valuemax="props.range ? endValue : props.max"
        :aria-valuenow="startValue"
        :aria-valuetext="getValueText(startValue)"
        :aria-orientation="props.vertical ? 'vertical' : 'horizontal'"
        :aria-disabled="props.disabled"
        :aria-invalid="validateState === 'error' ? 'true' : undefined"
        :aria-describedby="messageId"
        @mouseenter="handleThumbHover('start', true)"
        @mouseleave="handleThumbHover('start', false)"
        @focus="handleThumbFocus('start', $event)"
        @blur="handleThumbBlur('start', $event)"
        @mousedown="handleThumbPointerDown('start', $event)"
        @touchstart="handleThumbPointerDown('start', $event)"
        @keydown="moveByKeyboard('start', $event)"
      >
        <transition name="xy-fade">
          <div
            v-if="props.showTooltip && (props.persistent || isTooltipVisible('start'))"
            v-show="isTooltipVisible('start')"
            class="xy-slider__tooltip"
            :class="[
              `xy-slider__tooltip--${props.placement}`,
              props.tooltipClass
            ]"
          >
            {{ getTooltipContent(startValue) }}
          </div>
        </transition>
        <div class="xy-slider__thumb" />
      </div>

      <div
        v-if="props.range"
        ref="endThumbRef"
        class="xy-slider__thumb-wrapper"
        :class="[
          ns.is('dragging', draggingThumb === 'end'),
          ns.is('focused', focusedThumb === 'end'),
          ns.is('hover', hoveredThumb === 'end')
        ]"
        :style="getThumbStyle('end')"
        role="slider"
        :tabindex="props.disabled ? undefined : 0"
        :aria-label="props.rangeEndLabel"
        :aria-valuemin="startValue"
        :aria-valuemax="props.max"
        :aria-valuenow="endValue"
        :aria-valuetext="getValueText(endValue)"
        :aria-orientation="props.vertical ? 'vertical' : 'horizontal'"
        :aria-disabled="props.disabled"
        :aria-invalid="validateState === 'error' ? 'true' : undefined"
        :aria-describedby="messageId"
        @mouseenter="handleThumbHover('end', true)"
        @mouseleave="handleThumbHover('end', false)"
        @focus="handleThumbFocus('end', $event)"
        @blur="handleThumbBlur('end', $event)"
        @mousedown="handleThumbPointerDown('end', $event)"
        @touchstart="handleThumbPointerDown('end', $event)"
        @keydown="moveByKeyboard('end', $event)"
      >
        <transition name="xy-fade">
          <div
            v-if="props.showTooltip && (props.persistent || isTooltipVisible('end'))"
            v-show="isTooltipVisible('end')"
            class="xy-slider__tooltip"
            :class="[
              `xy-slider__tooltip--${props.placement}`,
              props.tooltipClass
            ]"
          >
            {{ getTooltipContent(endValue) }}
          </div>
        </transition>
        <div class="xy-slider__thumb" />
      </div>

      <div v-for="stop in stopList" :key="stop" class="xy-slider__stop" :style="getStopStyle(stop)" />
    </div>

    <xy-input-number
      v-if="renderInput"
      class="xy-slider__input"
      :model-value="startValue"
      :step="props.step"
      :precision="precision"
      :min="props.min"
      :max="props.max"
      :size="mergedInputSize"
      :controls="props.showInputControls"
      :disabled="props.disabled"
      align="right"
      @update:model-value="handleInputValue"
      @change="handleInputChange"
    />
  </div>
</template>
