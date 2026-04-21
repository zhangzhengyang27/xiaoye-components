<script setup lang="ts">
import { computed, inject } from "vue";
import type { Component } from "vue";

export interface RadioGroupOptionProps {
  value: string | number;
  disabled?: boolean;
  as?: string | Component;
}

const props = withDefaults(defineProps<RadioGroupOptionProps>(), {
  disabled: false,
  as: "div"
});

const slots = defineSlots<{
  default?: (props: { checked: boolean; active: boolean; disabled: boolean }) => unknown;
}>();

const radioGroupContext = inject<{
  selectedValue: Ref<string | number | null>;
  disabled: Ref<boolean>;
  selectOption: (value: string | number) => void;
} | null>("xy-radio-group-context", null);

const isChecked = computed(() => radioGroupContext?.selectedValue.value === props.value);
const isDisabled = computed(() => props.disabled || radioGroupContext?.disabled.value);

function handleClick() {
  if (isDisabled.value) return;
  radioGroupContext?.selectOption(props.value);
}
</script>

<template>
  <component
    :is="props.as"
    :class="[
      'xy-radio-group__option',
      {
        'is-checked': isChecked,
        'is-disabled': isDisabled
      }
    ]"
    role="radio"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
    @click="handleClick"
  >
    <slot :checked="isChecked" :active="false" :disabled="isDisabled" />
  </component>
</template>
