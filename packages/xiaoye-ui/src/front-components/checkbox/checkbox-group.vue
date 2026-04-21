<script setup lang="ts">
import { inject, computed } from "vue";
import { checkboxGroupContextKey, type CheckboxGroupOption } from "./checkbox-group-context";
import type { CheckboxValue } from "./checkbox";
import XyuIcon from "../icon/icon.vue";

const props = withDefaults(
  defineProps<{
    options?: CheckboxGroupOption[];
    disabled?: boolean;
    min?: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    modelValue?: CheckboxValue[];
  }>(),
  {
    options: () => [],
    disabled: false,
    min: undefined,
    max: undefined,
    size: "md",
    modelValue: () => []
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: CheckboxValue[]];
  change: [value: CheckboxValue[]];
}>();

const slots = defineSlots<{
  default?: () => unknown;
}>();

const group = useGroup();

function useGroup() {
  const ctx = inject<ReturnType<typeof import("./checkbox-group-context").useCheckboxGroup> | null>(
    checkboxGroupContextKey,
    null
  );
  return ctx;
}

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit("update:modelValue", val);
    emit("change", val);
  }
});

const ns = "xyu-checkbox-group";
</script>

<template>
  <div :class="ns">
    <slot>
      <template v-if="props.options.length > 0">
        <label
          v-for="opt in props.options"
          :key="opt.value"
          :class="[
            'xyu-checkbox__wrapper',
            `xyu-checkbox__wrapper--${props.size}`,
            localValue.includes(opt.value as CheckboxValue) ? 'is-checked' : '',
            (opt.disabled || props.disabled) ? 'is-disabled' : ''
          ]"
        >
          <input
            type="checkbox"
            class="xyu-checkbox__input"
            :value="opt.value"
            :disabled="opt.disabled || props.disabled"
            :checked="localValue.includes(opt.value as CheckboxValue)"
            @change="
              (e: Event) => {
                const checked = (e.target as HTMLInputElement).checked;
                const val = opt.value as CheckboxValue;
                if (checked) {
                  localValue = [...localValue, val];
                } else {
                  localValue = localValue.filter(v => v !== val);
                }
              }
            "
          />
          <span
            :class="[
              'xyu-checkbox__box',
              localValue.includes(opt.value as CheckboxValue) ? 'is-checked' : ''
            ]"
          >
              <XyuIcon icon="mdi:check" :size="12" />
          </span>
          <span class="xyu-checkbox__label">{{ opt.label }}</span>
        </label>
      </template>
    </slot>
  </div>
</template>
