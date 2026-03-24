<script setup lang="ts">
import { computed, inject, nextTick, ref, useSlots } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import { formItemKey } from "../../form/src/context";
import { checkboxGroupContextKey } from "./context";
import type { CheckboxProps, CheckboxValue } from "./checkbox";

const props = withDefaults(defineProps<CheckboxProps>(), {
  id: undefined,
  modelValue: undefined,
  value: undefined,
  label: undefined,
  indeterminate: false,
  disabled: false,
  checked: false,
  name: undefined,
  trueValue: undefined,
  falseValue: undefined,
  border: false,
  size: undefined,
  tabindex: undefined,
  validateEvent: true,
  ariaLabel: undefined,
  ariaControls: undefined
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

const trueValue = computed<CheckboxValue>(() => props.trueValue ?? true);
const falseValue = computed<CheckboxValue>(() => props.falseValue ?? false);
const mergedSize = computed(() => props.size ?? checkboxGroup?.size.value ?? globalSize.value);
const currentName = computed(() => props.name ?? checkboxGroup?.name.value);
const inputId = computed(() => props.id ?? (!checkboxGroup ? formItem?.inputId : undefined));
const hasLabel = computed(() => Boolean(slots.default) || props.label !== undefined);
const isChecked = computed(() => {
  if (checkboxGroup) {
    return checkboxGroup.modelValue.value.includes(actualValue.value);
  }

  if (props.modelValue !== undefined) {
    return props.modelValue === trueValue.value;
  }

  return props.checked;
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
const tabIndex = computed(() => (mergedDisabled.value ? -1 : props.tabindex ?? 0));

const compKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${mergedSize.value}`,
  mergedDisabled.value ? "is-disabled" : "",
  props.border ? "is-bordered" : "",
  isChecked.value ? "is-checked" : ""
]);

const spanKls = computed(() => [
  `${ns.base.value}__input`,
  mergedDisabled.value ? "is-disabled" : "",
  isChecked.value ? "is-checked" : "",
  props.indeterminate ? "is-indeterminate" : "",
  isFocused.value ? "is-focus" : ""
]);

async function handleChange() {
  if (mergedDisabled.value) {
    return;
  }

  if (checkboxGroup) {
    await checkboxGroup.changeValue(actualValue.value);
    emit("change", actualValue.value);
    return;
  }

  const nextValue = isChecked.value ? falseValue.value : trueValue.value;
  emit("update:modelValue", nextValue);
  await nextTick();
  emit("change", nextValue);

  if (props.validateEvent) {
    await formItem?.validate("change");
  }
}
</script>

<template>
  <label :class="compKls">
    <span :class="spanKls">
      <input
        :id="inputId"
        class="xy-checkbox__original"
        type="checkbox"
        :name="currentName"
        :checked="isChecked"
        :value="actualValue"
        :disabled="mergedDisabled"
        :tabindex="tabIndex"
        :indeterminate="props.indeterminate"
        :aria-label="props.ariaLabel"
        :aria-controls="props.ariaControls"
        :aria-checked="props.indeterminate ? 'mixed' : isChecked"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @change="handleChange"
      />
      <span class="xy-checkbox__inner" />
    </span>

    <span v-if="hasLabel" class="xy-checkbox__label">
      <slot>
        {{ props.label }}
      </slot>
    </span>
  </label>
</template>
