<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});

import { computed, inject, nextTick, ref, shallowRef, useAttrs, watch } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import { formItemKey } from "../../form/src/context";
import {
  DEFAULT_DECREASE_ICON,
  DEFAULT_DECREASE_ICON_RIGHT,
  DEFAULT_INCREASE_ICON,
  DEFAULT_INCREASE_ICON_RIGHT
} from "./input-number";
import type { InputNumberProps } from "./input-number";

const props = withDefaults(defineProps<InputNumberProps>(), {
  id: undefined,
  modelValue: null,
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  stepStrictly: false,
  precision: undefined,
  size: undefined,
  disabled: false,
  readonly: false,
  controls: true,
  controlsPosition: "",
  valueOnClear: null,
  placeholder: "",
  name: undefined,
  validateEvent: true,
  ariaLabel: undefined,
  inputmode: undefined,
  align: "center",
  disabledScientific: false
});

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
  input: [value: number | null];
  change: [value: number | null, oldValue: number | null];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const attrs = useAttrs();
const formItem = inject(formItemKey, null);
const ns = useNamespace("input-number");
const nsInput = useNamespace("input");
const { size: globalSize } = useConfig();

const inputRef = shallowRef<HTMLInputElement | null>(null);
const isFocused = ref(false);
const userInput = ref<string | null>(null);
const currentValue = ref<number | null>(null);

const mergedSize = computed(() => props.size ?? globalSize.value);
const inputId = computed(() => props.id ?? formItem?.inputId);
const messageId = computed(() => (formItem?.message.value ? formItem.messageId : undefined));
const validateState = computed(() => formItem?.validateState.value ?? "idle");
const controlsAtRight = computed(() => props.controls && props.controlsPosition === "right");
const inputDisabled = computed(() => props.disabled);
const minDisabled = computed(
  () => typeof currentValue.value === "number" && currentValue.value <= props.min
);
const maxDisabled = computed(
  () => typeof currentValue.value === "number" && currentValue.value >= props.max
);

const rootKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${mergedSize.value}`,
  ns.is("disabled", inputDisabled.value),
  ns.is("without-controls", !props.controls),
  ns.is("controls-right", controlsAtRight.value),
  ns.is(props.align, true),
  attrs.class
]);

const inputKls = computed(() => [
  nsInput.base.value,
  `${nsInput.base.value}--${mergedSize.value}`,
  validateState.value === "error" ? "is-error" : "",
  validateState.value === "success" ? "is-success" : "",
  inputDisabled.value ? "is-disabled" : "",
  isFocused.value ? "is-focus" : ""
]);

const inputStyle = computed(() => attrs.style);
const nativeAttrs = computed<Record<string, unknown>>(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  return rest;
});

const displayValue = computed(() => {
  if (userInput.value !== null) {
    return userInput.value;
  }

  if (currentValue.value === null) {
    return "";
  }

  if (props.precision !== undefined) {
    return currentValue.value.toFixed(props.precision);
  }

  return String(currentValue.value);
});

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value);
}

function isSameValue(a: number | null, b: number | null) {
  return a === b;
}

function getPrecision(value: number | null | undefined) {
  if (!isNumber(value)) {
    return 0;
  }

  const valueString = value.toString();
  const dotPosition = valueString.indexOf(".");

  return dotPosition === -1 ? 0 : valueString.length - dotPosition - 1;
}

function toPrecision(value: number, precision = props.precision ?? 0) {
  if (precision === 0) {
    return Math.round(value);
  }

  let stringified = String(value);
  const pointPosition = stringified.indexOf(".");

  if (pointPosition === -1) {
    return value;
  }

  const digits = stringified.replace(".", "").split("");
  const guard = digits[pointPosition + precision];

  if (!guard) {
    return value;
  }

  if (stringified.charAt(stringified.length - 1) === "5") {
    stringified = `${stringified.slice(0, Math.max(0, stringified.length - 1))}6`;
  }

  return Number.parseFloat(Number(stringified).toFixed(precision));
}

function normalizeStep(value: number) {
  if (!props.stepStrictly) {
    return value;
  }

  return toPrecision(
    Math.round(toPrecision(value / props.step, getPrecision(props.step))) * props.step
  );
}

function normalizeValue(value: number | null) {
  if (value === null) {
    return null;
  }

  let nextValue = normalizeStep(value);

  if (props.precision !== undefined) {
    nextValue = toPrecision(nextValue, props.precision);
  } else {
    nextValue = toPrecision(
      nextValue,
      Math.max(getPrecision(nextValue), getPrecision(props.step), getPrecision(props.modelValue))
    );
  }

  if (nextValue > props.max) {
    nextValue = props.max;
  }

  if (nextValue < props.min) {
    nextValue = props.min;
  }

  return nextValue;
}

function parseInputValue(value: string) {
  const trimmed = value.trim();

  if (trimmed === "") {
    return null;
  }

  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(trimmed)) {
    return Number.NaN;
  }

  return Number(trimmed);
}

function getClearValue() {
  if (props.valueOnClear === "min") {
    return props.min;
  }

  if (props.valueOnClear === "max") {
    return props.max;
  }

  if (typeof props.valueOnClear === "number") {
    return props.valueOnClear;
  }

  return null;
}

function syncInputElement() {
  if (inputRef.value && inputRef.value.value !== displayValue.value) {
    inputRef.value.value = displayValue.value;
  }
}

function clearStaleValidation(nextValue: number | null) {
  if (nextValue === null) {
    return;
  }

  if (formItem?.validateState.value === "error") {
    formItem.clearValidate();
  }
}

function applyValue(
  nextValue: number | null,
  options?: { emitInput?: boolean; emitChange?: boolean }
) {
  const previousValue = currentValue.value;

  userInput.value = null;
  currentValue.value = nextValue;
  clearStaleValidation(nextValue);

  if (options?.emitInput) {
    emit("input", nextValue);
  }

  if (!isSameValue(previousValue, nextValue)) {
    emit("update:modelValue", nextValue);
  }

  if (options?.emitChange && !isSameValue(previousValue, nextValue)) {
    emit("change", nextValue, previousValue);
  }

  nextTick(() => {
    syncInputElement();
  });
}

async function triggerChangeValidation() {
  if (props.validateEvent) {
    await nextTick();
    await formItem?.validate("change");
  }
}

async function commitInputValue(rawValue: string) {
  const previousValue = currentValue.value;
  let nextValue: number | null;

  if (rawValue.trim() === "") {
    nextValue = normalizeValue(getClearValue());
  } else {
    const parsedValue = parseInputValue(rawValue);
    nextValue = Number.isNaN(parsedValue) ? previousValue : normalizeValue(parsedValue);
  }

  applyValue(nextValue, { emitChange: true });
  await triggerChangeValidation();
}

function increase() {
  if (props.readonly || inputDisabled.value || maxDisabled.value) {
    return;
  }

  const baseValue = currentValue.value ?? 0;
  const precision = Math.max(
    getPrecision(baseValue),
    getPrecision(props.step),
    props.precision ?? 0
  );
  const nextValue = normalizeValue(toPrecision(baseValue + props.step, precision));

  applyValue(nextValue, {
    emitInput: true,
    emitChange: true
  });
  void triggerChangeValidation();
}

function decrease() {
  if (props.readonly || inputDisabled.value || minDisabled.value) {
    return;
  }

  const baseValue = currentValue.value ?? 0;
  const precision = Math.max(
    getPrecision(baseValue),
    getPrecision(props.step),
    props.precision ?? 0
  );
  const nextValue = normalizeValue(toPrecision(baseValue - props.step, precision));

  applyValue(nextValue, {
    emitInput: true,
    emitChange: true
  });
  void triggerChangeValidation();
}

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  userInput.value = value;

  if (value.trim() === "") {
    emit("input", null);
    emit("update:modelValue", null);
    return;
  }

  const parsedValue = parseInputValue(value);

  if (Number.isNaN(parsedValue)) {
    return;
  }

  const nextValue = normalizeValue(parsedValue);
  clearStaleValidation(nextValue);
  emit("input", nextValue);
  emit("update:modelValue", nextValue);
}

async function handleChange(event: Event) {
  await commitInputValue((event.target as HTMLInputElement).value);
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabledScientific && (event.key === "e" || event.key === "E")) {
    event.preventDefault();
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    increase();
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    decrease();
  }
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true;
  emit("focus", event);
}

async function handleBlur(event: FocusEvent) {
  isFocused.value = false;
  emit("blur", event);

  if (userInput.value !== null) {
    await commitInputValue(userInput.value);
  }

  if (props.validateEvent) {
    await nextTick();
    await formItem?.validate("blur");
  }
}

function focus() {
  inputRef.value?.focus();
}

function blur() {
  inputRef.value?.blur();
}

watch(
  () => props.modelValue,
  (value) => {
    const normalizedValue = normalizeValue(isNumber(value) ? value : null);

    if (userInput.value === null) {
      currentValue.value = normalizedValue;
      nextTick(() => {
        syncInputElement();
      });
    }

    clearStaleValidation(normalizedValue);

    if (!isSameValue(value ?? null, normalizedValue)) {
      emit("update:modelValue", normalizedValue);
    }
  },
  {
    immediate: true
  }
);

watch(
  () => [props.min, props.max, props.step, props.stepStrictly, props.precision] as const,
  () => {
    const normalizedValue = normalizeValue(currentValue.value);

    if (!isSameValue(currentValue.value, normalizedValue)) {
      applyValue(normalizedValue);
    }
  }
);

defineExpose({
  input: inputRef,
  focus,
  blur,
  increase,
  decrease
});
</script>

<template>
  <div :class="rootKls" :style="inputStyle">
    <button
      v-if="props.controls"
      class="xy-input-number__decrease"
      :class="{ 'is-disabled': minDisabled }"
      type="button"
      :tabindex="inputDisabled || props.readonly ? -1 : 0"
      aria-label="decrease"
      @click="decrease"
    >
      <slot name="decrease-icon">
        <XyIcon
          :icon="controlsAtRight ? DEFAULT_DECREASE_ICON_RIGHT : DEFAULT_DECREASE_ICON"
          :size="14"
        />
      </slot>
    </button>

    <button
      v-if="props.controls"
      class="xy-input-number__increase"
      :class="{ 'is-disabled': maxDisabled }"
      type="button"
      :tabindex="inputDisabled || props.readonly ? -1 : 0"
      aria-label="increase"
      @click="increase"
    >
      <slot name="increase-icon">
        <XyIcon
          :icon="controlsAtRight ? DEFAULT_INCREASE_ICON_RIGHT : DEFAULT_INCREASE_ICON"
          :size="14"
        />
      </slot>
    </button>

    <div :class="inputKls">
      <div class="xy-input__wrapper">
        <input
          :id="inputId"
          ref="inputRef"
          class="xy-input__inner"
          v-bind="nativeAttrs"
          :value="displayValue"
          type="text"
          role="spinbutton"
          :name="props.name"
          :placeholder="props.placeholder"
          :disabled="inputDisabled"
          :readonly="props.readonly"
          :inputmode="
            props.inputmode ??
            (props.precision || String(props.step).includes('.') ? 'decimal' : 'numeric')
          "
          :aria-label="props.ariaLabel"
          :aria-describedby="messageId"
          :aria-invalid="validateState === 'error'"
          :aria-valuemax="Number.isFinite(props.max) ? props.max : undefined"
          :aria-valuemin="Number.isFinite(props.min) ? props.min : undefined"
          :aria-valuenow="currentValue ?? undefined"
          :aria-disabled="inputDisabled"
          @keydown="handleKeydown"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
          @change="handleChange"
        />
      </div>
    </div>
  </div>
</template>
