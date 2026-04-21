<script setup lang="ts">
import { computed, provide, ref, watch } from "vue";
import type { Component } from "vue";

export interface RadioGroupOptionData {
  value: string | number;
  disabled?: boolean;
  label?: string;
}

export interface RadioGroupRootProps {
  modelValue?: string | number | null;
  options?: RadioGroupOptionData[];
  disabled?: boolean;
  as?: string | Component;
}

const props = withDefaults(defineProps<RadioGroupRootProps>(), {
  modelValue: null,
  options: () => [],
  disabled: false,
  as: "div"
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number | null];
  change: [value: string | number | null];
}>();

const slots = defineSlots<{
  default?: () => unknown;
}>();

const selectedValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val;
  }
);

async function selectOption(value: string | number) {
  const option = props.options.find((opt) => opt.value === value);
  if (option?.disabled || props.disabled) return;

  selectedValue.value = value;
  emit("update:modelValue", value);
  emit("change", value);
}

const context = {
  selectedValue,
  disabled: computed(() => props.disabled),
  selectOption
};

provide("xy-radio-group-context", context);

defineExpose({
  selectOption
});
</script>

<template>
  <component :is="props.as" class="xy-radio-group" role="radiogroup">
    <slot />
  </component>
</template>
