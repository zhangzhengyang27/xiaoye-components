import { computed, provide, ref } from "vue";
import type { CheckboxValue } from "./checkbox";

export interface CheckboxGroupOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  modelValue?: CheckboxValue[];
  options?: CheckboxGroupOption[];
  disabled?: boolean;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

const checkboxGroupContextKey = Symbol("xyu-checkbox-group") as symbol;

export function useCheckboxGroup(props: CheckboxGroupProps) {
  const modelValue = ref<CheckboxValue[]>(props.modelValue ?? []);

  function isChecked(value: CheckboxValue) {
    return modelValue.value.includes(value);
  }

  function toggle(value: CheckboxValue) {
    const idx = modelValue.value.indexOf(value);
    if (idx > -1) {
      modelValue.value = modelValue.value.filter((v) => v !== value);
    } else {
      modelValue.value = [...modelValue.value, value];
    }
  }

  function isLimitDisabled(value: CheckboxValue) {
    if (value && !modelValue.value.includes(value)) {
      if (props.max !== undefined && modelValue.value.length >= props.max) return true;
    }
    if (value && modelValue.value.includes(value)) {
      if (props.min !== undefined && modelValue.value.length <= props.min) return true;
    }
    return false;
  }

  provide(checkboxGroupContextKey, {
    modelValue,
    disabled: computed(() => props.disabled),
    min: computed(() => props.min),
    max: computed(() => props.max),
    isChecked,
    toggle,
    isLimitDisabled,
    size: computed(() => props.size ?? "md")
  });

  return { modelValue, isChecked, toggle, isLimitDisabled };
}

export { checkboxGroupContextKey };
