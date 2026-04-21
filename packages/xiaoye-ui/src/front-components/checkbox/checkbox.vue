<script setup lang="ts">
import { computed, ref } from "vue";
import type { CheckboxProps, CheckboxValue } from "./checkbox";

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: undefined,
  label: "",
  disabled: false,
  checked: false,
  indeterminate: false,
  size: "md",
  border: false
});

const emit = defineEmits<{
  "update:modelValue": [value: CheckboxValue];
  change: [value: CheckboxValue];
}>();

const slots = defineSlots<{
  default?: () => unknown;
}>();

const ns = "xyu-checkbox";

const isChecked = computed(() => {
  if (props.modelValue !== undefined) {
    return Boolean(props.modelValue);
  }
  return props.checked;
});

const wrapperClasses = computed(() => [
  `${ns}__wrapper`,
  `${ns}__wrapper--${props.size}`,
  isChecked.value ? "is-checked" : "",
  props.indeterminate ? "is-indeterminate" : "",
  props.disabled ? "is-disabled" : "",
  props.border ? "is-bordered" : ""
]);

function handleChange() {
  if (props.disabled) return;
  const newValue = !isChecked.value;
  emit("update:modelValue", newValue as CheckboxValue);
  emit("change", newValue as CheckboxValue);
}
</script>

<template>
  <label :class="wrapperClasses">
    <input
      type="checkbox"
      :class="`${ns}__input`"
      :checked="isChecked"
      :disabled="props.disabled"
      @change="handleChange"
    />
    <span :class="[`${ns}__box`, isChecked ? 'is-checked' : '', props.indeterminate ? 'is-indeterminate' : '']">
      <svg
        v-if="isChecked && !props.indeterminate"
        width="12" height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <svg
        v-else-if="props.indeterminate"
        width="12" height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </span>
    <span v-if="slots.default || props.label" :class="`${ns}__label`">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>
