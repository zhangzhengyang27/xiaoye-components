<script setup lang="ts">
import { computed, ref } from "vue";
import type { CheckboxProps, CheckboxValue } from "./checkbox";
import XyuIcon from "../icon/icon.vue";

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
        <XyuIcon :icon="props.indeterminate ? 'mdi:minus' : 'mdi:check'" :size="12" />
    </span>
    <span v-if="slots.default || props.label" :class="`${ns}__label`">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>
