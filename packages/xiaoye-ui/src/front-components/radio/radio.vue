<script setup lang="ts">
import { computed } from "vue";
import type { RadioProps } from "./radio";

const props = withDefaults(defineProps<RadioProps>(), {
  label: "",
  disabled: false,
  checked: false,
  size: "md",
  border: false
});

const emit = defineEmits<{
  "update:modelValue": [value: unknown];
  change: [value: unknown];
}>();

const slots = defineSlots<{
  default?: () => unknown;
}>();

const ns = "xyu-radio";

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
  props.disabled ? "is-disabled" : "",
  props.border ? "is-bordered" : ""
]);

function handleChange() {
  if (props.disabled) return;
  emit("update:modelValue", true);
  emit("change", true);
}
</script>

<template>
  <label :class="wrapperClasses">
    <input
      type="radio"
      :class="`${ns}__input`"
      :checked="isChecked"
      :disabled="props.disabled"
      :name="props.name"
      @change="handleChange"
    />
    <span :class="[`${ns}__dot`, isChecked ? 'is-checked' : '']">
      <span v-if="isChecked" :class="`${ns}__dot-inner`" />
    </span>
    <span v-if="slots.default || props.label" :class="`${ns}__label`">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>
