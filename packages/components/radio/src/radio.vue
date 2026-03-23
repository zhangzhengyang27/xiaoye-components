<script setup lang="ts">
import { computed, inject, nextTick, ref, useSlots } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import { formItemKey } from "../../form/src/context";
import { radioGroupContextKey } from "./context";
import type { RadioProps } from "./radio";

const props = withDefaults(defineProps<RadioProps>(), {
  id: undefined,
  modelValue: undefined,
  label: undefined,
  disabled: false,
  size: undefined,
  name: undefined,
  border: false
});

const emit = defineEmits<{
  "update:modelValue": [value: RadioProps["value"]];
  change: [value: RadioProps["value"]];
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
const inputId = computed(() => props.id ?? (!radioGroup ? formItem?.inputId : undefined));
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

const radioClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--${mergedSize.value}`,
  checked.value ? "is-checked" : "",
  mergedDisabled.value ? "is-disabled" : "",
  focus.value ? "is-focus" : "",
  props.border ? "is-bordered" : ""
]);

const inputClasses = computed(() => [
  `${ns.base.value}__input`,
  checked.value ? "is-checked" : "",
  mergedDisabled.value ? "is-disabled" : ""
]);

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
  <label :class="radioClasses">
    <span :class="inputClasses">
      <input
        :id="inputId"
        class="xy-radio__original"
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
      <span class="xy-radio__inner" />
    </span>
    <span v-if="hasLabel" class="xy-radio__label">
      <slot>
        {{ props.label }}
      </slot>
    </span>
  </label>
</template>
