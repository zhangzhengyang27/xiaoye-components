<script setup lang="ts">
import { computed, inject } from "vue";
import type { ComponentSize } from "@xiaoye/utils";
import { useConfig, useNamespace } from "@xiaoye/composables";
import { formItemKey } from "../../form/src/context";

export interface InputProps {
  modelValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  readonly?: boolean;
  type?: "text" | "password" | "email" | "search" | "number";
  size?: ComponentSize;
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: "",
  placeholder: "",
  disabled: false,
  clearable: false,
  readonly: false,
  type: "text",
  size: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
  clear: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const formItem = inject(formItemKey, null);
const ns = useNamespace("input");
const { size: globalSize } = useConfig();
const mergedSize = computed(() => props.size ?? globalSize.value);
const stringValue = computed(() => `${props.modelValue ?? ""}`);

function handleInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}

async function handleChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit("change", value);
  await formItem?.validate("change");
}

async function handleBlur(event: FocusEvent) {
  emit("blur", event);
  await formItem?.validate("blur");
}

function handleClear() {
  emit("update:modelValue", "");
  emit("clear");
  formItem?.clearValidate();
}
</script>

<template>
  <label
    :class="[
      ns.base.value,
      `${ns.base.value}--${mergedSize}`,
      props.disabled ? 'is-disabled' : '',
      formItem?.validateState.value === 'error' ? 'is-error' : ''
    ]"
  >
    <span v-if="$slots.prefix" class="xy-input__prefix">
      <slot name="prefix" />
    </span>
    <input
      :id="formItem?.inputId"
      :value="stringValue"
      :type="props.type"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :aria-describedby="formItem?.message.value ? formItem.messageId : undefined"
      :aria-invalid="formItem?.validateState.value === 'error'"
      @input="handleInput"
      @change="handleChange"
      @focus="emit('focus', $event)"
      @blur="handleBlur"
    />
    <button
      v-if="props.clearable && stringValue && !props.disabled && !props.readonly"
      class="xy-input__clear"
      type="button"
      aria-label="clear"
      @click.prevent="handleClear"
    >
      ×
    </button>
    <span v-if="$slots.suffix" class="xy-input__suffix">
      <slot name="suffix" />
    </span>
  </label>
</template>
