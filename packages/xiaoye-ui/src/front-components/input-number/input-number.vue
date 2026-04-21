<script setup lang="ts">
import { computed, ref } from "vue";
import type { InputNumberProps } from "./input-number";

const props = withDefaults(defineProps<InputNumberProps>(), {
  modelValue: 0,
  min: -Infinity,
  max: Infinity,
  step: 1,
  size: "md",
  disabled: false,
  readonly: false,
  precision: undefined,
  controls: true,
  controlsPosition: "right",
  placeholder: ""
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
  change: [value: number];
}>();

const ns = "xyu-input-number";
const focused = ref(false);

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    const num = Number(val);
    if (isNaN(num)) return;
    const clamped = Math.min(props.max, Math.max(props.min, num));
    const final = props.precision !== undefined
      ? parseFloat(clamped.toFixed(props.precision))
      : clamped;
    emit("update:modelValue", final);
  }
});

const atMin = computed(() => props.modelValue <= props.min);
const atMax = computed(() => props.modelValue >= props.max);

function increment() {
  if (props.disabled || props.readonly) return;
  const newVal = props.modelValue + props.step;
  const clamped = Math.min(props.max, newVal);
  const final = props.precision !== undefined
    ? parseFloat(clamped.toFixed(props.precision))
    : clamped;
  emit("update:modelValue", final);
  emit("change", final);
}

function decrement() {
  if (props.disabled || props.readonly) return;
  const newVal = props.modelValue - props.step;
  const clamped = Math.max(props.min, newVal);
  const final = props.precision !== undefined
    ? parseFloat(clamped.toFixed(props.precision))
    : clamped;
  emit("update:modelValue", final);
  emit("change", final);
}

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const val = target.value === "" ? 0 : Number(target.value);
  if (!isNaN(val)) {
    inputValue.value = val;
  }
}
</script>

<template>
  <div :class="[ns, `${ns}--${props.size}`, props.disabled ? 'is-disabled' : '', props.readonly ? 'is-readonly' : '', focused ? 'is-focused' : '']">
    <div :class="`${ns}__wrapper`">
      <span
        v-if="props.controls && props.controlsPosition === 'both'"
        :class="[`${ns}__btn`, `${ns}__btn--dec`, atMin || props.disabled ? 'is-disabled' : '']"
        @click="decrement"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>

      <input
        v-model="inputValue"
        :class="`${ns}__input`"
        type="number"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :placeholder="props.placeholder"
        @focus="focused = true"
        @blur="focused = false"
        @input="handleInput"
      />

      <span
        v-if="props.controls && props.controlsPosition !== 'right'"
        :class="[`${ns}__btn`, `${ns}__btn--inc`, atMax || props.disabled ? 'is-disabled' : '']"
        @click="increment"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>

      <span
        v-if="props.controls && props.controlsPosition === 'right'"
        :class="[`${ns}__btn`, `${ns}__btn--inc`, atMax || props.disabled ? 'is-disabled' : '']"
        @click="increment"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>

      <span
        v-if="props.controls && props.controlsPosition === 'right'"
        :class="[`${ns}__btn`, `${ns}__btn--dec`, atMin || props.disabled ? 'is-disabled' : '']"
        @click="decrement"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>
    </div>
  </div>
</template>
