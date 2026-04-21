<script setup lang="ts">
import { computed, ref } from "vue";
import type { InputNumberProps } from "./input-number";
import XyuIcon from "../icon/icon.vue";

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

const atMin = computed(() => props.modelValue <= props.min);
const atMax = computed(() => props.modelValue >= props.max);

function round(val: number) {
  return props.precision !== undefined
    ? parseFloat(val.toFixed(props.precision))
    : val;
}

function clamp(val: number) {
  return Math.min(props.max, Math.max(props.min, val));
}

function emitValue(val: number) {
  emit("update:modelValue", val);
  emit("change", val);
}

function increment() {
  if (props.disabled || props.readonly) return;
  emitValue(round(clamp(props.modelValue + props.step)));
}

function decrement() {
  if (props.disabled || props.readonly) return;
  emitValue(round(clamp(props.modelValue - props.step)));
}

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const val = target.value === "" ? 0 : Number(target.value);
  if (!isNaN(val)) {
    emitValue(round(clamp(val)));
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
        <XyuIcon icon="mdi:minus" :size="12" />
      </span>

      <input
        v-model.number="props.modelValue"
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
        <XyuIcon icon="mdi:plus" :size="12" />
      </span>

      <span
        v-if="props.controls && props.controlsPosition === 'right'"
        :class="[`${ns}__btn`, `${ns}__btn--inc`, atMax || props.disabled ? 'is-disabled' : '']"
        @click="increment"
      >
        <XyuIcon icon="mdi:plus" :size="12" />
      </span>

      <span
        v-if="props.controls && props.controlsPosition === 'right'"
        :class="[`${ns}__btn`, `${ns}__btn--dec`, atMin || props.disabled ? 'is-disabled' : '']"
        @click="decrement"
      >
        <XyuIcon icon="mdi:minus" :size="12" />
      </span>
    </div>
  </div>
</template>
