<script setup lang="ts">
import { computed, inject, nextTick, ref, useSlots } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import { formItemKey } from "../../form/src/context";
import { checkboxGroupContextKey } from "./context";
import type { CheckboxValue } from "./checkbox";
import type { CheckboxButtonProps } from "./checkbox-button";

const props = withDefaults(defineProps<CheckboxButtonProps>(), {
  modelValue: undefined,
  value: undefined,
  label: undefined,
  disabled: false,
  size: undefined,
  name: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: CheckboxValue];
  change: [value: CheckboxValue];
}>();

const slots = useSlots();
const ns = useNamespace("checkbox");
const { size: globalSize } = useConfig();
const formItem = inject(formItemKey, null);
const checkboxGroup = inject(checkboxGroupContextKey, null);

const isFocused = ref(false);

const actualValue = computed<CheckboxValue>(() => {
  if (props.value !== undefined) {
    return props.value;
  }

  if (props.label !== undefined) {
    return props.label;
  }

  return true;
});

const mergedSize = computed(() => props.size ?? checkboxGroup?.size.value ?? globalSize.value);
const currentName = computed(() => props.name ?? checkboxGroup?.name.value);
const hasLabel = computed(() => Boolean(slots.default) || props.label !== undefined);
const isChecked = computed(() => {
  if (checkboxGroup) {
    return checkboxGroup.modelValue.value.includes(actualValue.value);
  }

  return props.modelValue === actualValue.value;
});
const limitDisabled = computed(() => {
  if (!checkboxGroup) {
    return false;
  }

  if (isChecked.value) {
    return checkboxGroup.min.value !== undefined && checkboxGroup.modelValue.value.length <= checkboxGroup.min.value;
  }

  return checkboxGroup.max.value !== undefined && checkboxGroup.modelValue.value.length >= checkboxGroup.max.value;
});
const mergedDisabled = computed(() => Boolean(props.disabled || checkboxGroup?.disabled.value || limitDisabled.value));
const tabIndex = computed(() => (mergedDisabled.value ? -1 : 0));

const buttonClasses = computed(() => [
  `${ns.base.value}-button`,
  `${ns.base.value}-button--${mergedSize.value}`,
  isChecked.value ? "is-checked" : "",
  mergedDisabled.value ? "is-disabled" : "",
  isFocused.value ? "is-focus" : ""
]);

const activeStyles = computed(() => {
  if (!isChecked.value) {
    return undefined;
  }

  return {
    backgroundColor: checkboxGroup?.fill.value,
    borderColor: checkboxGroup?.fill.value,
    color: checkboxGroup?.textColor.value,
    boxShadow: checkboxGroup?.fill.value ? `-1px 0 0 0 ${checkboxGroup.fill.value}` : undefined
  };
});

async function handleChange() {
  if (mergedDisabled.value) {
    return;
  }

  if (checkboxGroup) {
    await checkboxGroup.changeValue(actualValue.value);
    emit("change", actualValue.value);
    return;
  }

  emit("update:modelValue", actualValue.value);
  await nextTick();
  emit("change", actualValue.value);
  await formItem?.validate("change");
}
</script>

<template>
  <label :class="buttonClasses">
    <input
      class="xy-checkbox-button__original"
      type="checkbox"
      :name="currentName"
      :checked="isChecked"
      :value="actualValue"
      :disabled="mergedDisabled"
      :tabindex="tabIndex"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @change="handleChange"
    />
    <span class="xy-checkbox-button__inner" :style="activeStyles">
      <slot v-if="hasLabel">
        {{ props.label }}
      </slot>
    </span>
  </label>
</template>
