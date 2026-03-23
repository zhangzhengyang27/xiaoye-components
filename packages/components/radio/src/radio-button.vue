<script setup lang="ts">
import { computed, inject, nextTick, ref, useSlots } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import { formItemKey } from "../../form/src/context";
import { radioGroupContextKey } from "./context";
import type { RadioButtonProps } from "./radio-button";

const props = withDefaults(defineProps<RadioButtonProps>(), {
  modelValue: undefined,
  label: undefined,
  disabled: false,
  size: undefined,
  name: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: RadioButtonProps["value"]];
  change: [value: RadioButtonProps["value"]];
}>();

const slots = useSlots();
const ns = useNamespace("radio");
const { size: globalSize } = useConfig();
const formItem = inject(formItemKey, null);
const radioGroup = inject(radioGroupContextKey, null);

const focus = ref(false);

const mergedSize = computed(() => props.size ?? radioGroup?.size.value ?? globalSize.value);
const mergedDisabled = computed(() => Boolean(props.disabled || radioGroup?.disabled.value));
const currentValue = computed(() => radioGroup?.modelValue.value ?? props.modelValue);
const checked = computed(() => currentValue.value === props.value);
const currentName = computed(() => props.name ?? radioGroup?.name.value);
const hasLabel = computed(() => Boolean(slots.default) || props.label !== undefined);
const tabIndex = computed(() => {
  if (mergedDisabled.value) {
    return -1;
  }

  if (radioGroup && !checked.value) {
    return -1;
  }

  return 0;
});

const buttonClasses = computed(() => [
  `${ns.base.value}-button`,
  `${ns.base.value}-button--${mergedSize.value}`,
  checked.value ? "is-active" : "",
  mergedDisabled.value ? "is-disabled" : "",
  focus.value ? "is-focus" : ""
]);

const activeStyles = computed(() => {
  if (!checked.value) {
    return undefined;
  }

  return {
    backgroundColor: radioGroup?.fill.value,
    borderColor: radioGroup?.fill.value,
    color: radioGroup?.textColor.value,
    boxShadow: radioGroup?.fill.value ? `-1px 0 0 0 ${radioGroup.fill.value}` : undefined
  };
});

async function handleChange() {
  if (mergedDisabled.value || checked.value) {
    return;
  }

  if (radioGroup) {
    await radioGroup.changeValue(props.value);
    emit("change", props.value);
    return;
  }

  emit("update:modelValue", props.value);
  await nextTick();
  emit("change", props.value);
  await formItem?.validate("change");
}
</script>

<template>
  <label :class="buttonClasses">
    <input
      class="xy-radio-button__original"
      type="radio"
      :name="currentName"
      :checked="checked"
      :value="props.value"
      :disabled="mergedDisabled"
      :tabindex="tabIndex"
      @focus="focus = true"
      @blur="focus = false"
      @change="handleChange"
    />
    <span class="xy-radio-button__inner" :style="activeStyles">
      <slot v-if="hasLabel">
        {{ props.label }}
      </slot>
    </span>
  </label>
</template>
