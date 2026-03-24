<script setup lang="ts">
import { computed, inject, nextTick, provide, toRef } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import { formItemKey } from "../../form/src/context";
import Checkbox from "./checkbox.vue";
import CheckboxButton from "./checkbox-button.vue";
import { checkboxGroupContextKey } from "./context";
import type { CheckboxValue } from "./checkbox";
import type { CheckboxGroupProps, CheckboxGroupValue } from "./checkbox-group";

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  modelValue: () => [],
  options: () => [],
  type: "checkbox",
  disabled: false,
  size: undefined,
  name: undefined,
  direction: "horizontal",
  validateEvent: true,
  ariaLabel: undefined,
  fill: undefined,
  textColor: undefined,
  min: undefined,
  max: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: CheckboxGroupValue];
  change: [value: CheckboxGroupValue];
}>();

const ns = useNamespace("checkbox");
const { size: globalSize } = useConfig();
const formItem = inject(formItemKey, null);
const fallbackName = `xy-checkbox-${Math.random().toString(36).slice(2, 10)}`;

const mergedSize = computed(() => props.size ?? globalSize.value);
const groupName = computed(() => props.name ?? fallbackName);
const optionComponent = computed(() => (props.type === "button" ? CheckboxButton : Checkbox));

const groupClasses = computed(() => [
  `${ns.base.value}-group`,
  `${ns.base.value}-group--${props.direction}`,
  props.type === "button" ? `${ns.base.value}-group--button` : ""
]);

const groupStyles = computed(() => ({
  "--xy-checkbox-button-fill": props.fill,
  "--xy-checkbox-button-text-color": props.textColor
}));

async function changeValue(value: CheckboxValue) {
  if (props.disabled) {
    return;
  }

  const nextValue = props.modelValue.slice();
  const index = nextValue.findIndex((item) => item === value);
  const checked = index > -1;

  if (checked) {
    if (props.min !== undefined && nextValue.length <= props.min) {
      return;
    }
    nextValue.splice(index, 1);
  } else {
    if (props.max !== undefined && nextValue.length >= props.max) {
      return;
    }
    nextValue.push(value);
  }

  emit("update:modelValue", nextValue);
  await nextTick();
  emit("change", nextValue);

  if (props.validateEvent) {
    await formItem?.validate("change");
  }
}

provide(checkboxGroupContextKey, {
  modelValue: toRef(props, "modelValue"),
  disabled: toRef(props, "disabled"),
  size: mergedSize,
  name: groupName,
  fill: toRef(props, "fill"),
  textColor: toRef(props, "textColor"),
  min: toRef(props, "min"),
  max: toRef(props, "max"),
  changeValue
});
</script>

<template>
  <div
    :class="groupClasses"
    :style="groupStyles"
    role="group"
    :aria-label="props.ariaLabel ?? 'checkbox-group'"
  >
    <slot>
      <component
        :is="optionComponent"
        v-for="option in props.options"
        :key="String(option.value)"
        :value="option.value"
        :label="option.label"
        :disabled="option.disabled"
      >
        <span
          :class="[
            `${ns.base.value}-group__option`,
            option.description ? 'has-description' : ''
          ]"
        >
          <span :class="`${ns.base.value}-group__option-label`">{{ option.label }}</span>
          <span
            v-if="option.description"
            :class="`${ns.base.value}-group__option-description`"
          >
            {{ option.description }}
          </span>
        </span>
      </component>
    </slot>
  </div>
</template>
