<script setup lang="ts">
import { computed, ref, useSlots, watchEffect } from "vue";
import { XyIcon, XyInput } from "@xiaoye/components";
import { isDev, warnOnce } from "@xiaoye/utils";
import type { FrontInputProps } from "./input";

const props = withDefaults(defineProps<FrontInputProps>(), {
  modelValue: "",
  type: "text",
  placeholder: "输入内容",
  size: "md",
  clearable: false,
  variant: "default",
  leadingIcon: "",
  trailingIcon: "",
  prefixIcon: "",
  suffixIcon: ""
});
const slots = useSlots();

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  input: [value: string | number];
  change: [value: string | number];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const focused = ref(false);
const rootClass = computed(() => [
  "xy-frontline-theme",
  "xy-frontline-input",
  `xy-frontline-input--${props.variant}`
]);
const valueState = computed(() => (props.modelValue == null || props.modelValue === "" ? "empty" : "filled"));
const resolvedLeadingIcon = computed(() => props.leadingIcon || props.prefixIcon);
const resolvedTrailingIcon = computed(() => props.trailingIcon || props.suffixIcon);

if (isDev()) {
  watchEffect(() => {
    if (props.prefixIcon && !props.leadingIcon) {
      warnOnce("XyFrontInput", "`prefixIcon` 已降级，后续请改用 `leadingIcon`。");
    }

    if (props.suffixIcon && !props.trailingIcon) {
      warnOnce("XyFrontInput", "`suffixIcon` 已降级，后续请改用 `trailingIcon`。");
    }

    if (slots.prefix && !slots.leading) {
      warnOnce("XyFrontInput", "`prefix` slot 已降级，后续请改用 `leading`。");
    }

    if (slots.suffix && !slots.trailing) {
      warnOnce("XyFrontInput", "`suffix` slot 已降级，后续请改用 `trailing`。");
    }
  });
}
</script>

<template>
  <div
    :class="rootClass"
    :data-slot="'root'"
    :data-state="focused ? 'focused' : 'idle'"
    :data-value-state="valueState"
    :data-variant="props.variant"
    :data-size="props.size"
  >
    <XyInput
      :model-value="props.modelValue"
      :type="props.type"
      :placeholder="props.placeholder"
      :size="props.size"
      :clearable="props.clearable"
      :prefix-icon="resolvedLeadingIcon"
      :suffix-icon="resolvedTrailingIcon"
      :data-slot="'input'"
      :data-state="focused ? 'focused' : 'idle'"
      :data-value-state="valueState"
      @update:model-value="emit('update:modelValue', $event)"
      @input="emit('input', $event)"
      @change="emit('change', $event)"
      @focus="
        focused = true;
        emit('focus', $event);
      "
      @blur="
        focused = false;
        emit('blur', $event);
      "
    >
      <template v-if="resolvedLeadingIcon || $slots.leading || $slots.prefix" #prefix>
        <slot name="leading" :state="focused ? 'focused' : 'idle'">
          <slot name="prefix" :state="focused ? 'focused' : 'idle'">
            <XyIcon v-if="resolvedLeadingIcon" :icon="resolvedLeadingIcon" />
          </slot>
        </slot>
      </template>
      <template v-if="resolvedTrailingIcon || $slots.trailing || $slots.suffix" #suffix>
        <slot name="trailing" :state="focused ? 'focused' : 'idle'">
          <slot name="suffix" :state="focused ? 'focused' : 'idle'">
            <XyIcon v-if="resolvedTrailingIcon" :icon="resolvedTrailingIcon" />
          </slot>
        </slot>
      </template>
      <template v-if="$slots.prepend" #prepend>
        <slot name="prepend" :state="focused ? 'focused' : 'idle'" />
      </template>
      <template v-if="$slots.append" #append>
        <slot name="append" :state="focused ? 'focused' : 'idle'" />
      </template>
    </XyInput>
  </div>
</template>

<style scoped>
.xy-frontline-input :deep(.xy-input__wrapper) {
  border-radius: 24px;
  border-color: rgba(148, 163, 184, 0.2);
  min-height: 50px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
}

.xy-frontline-input--soft :deep(.xy-input__wrapper) {
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(241, 245, 249, 0.94));
}

.xy-frontline-input--underline :deep(.xy-input__wrapper) {
  border-radius: 0;
  border-width: 0 0 1px;
  background: transparent;
  box-shadow: none;
}

.xy-frontline-input[data-state="focused"] :deep(.xy-input__wrapper) {
  border-color: rgba(20, 99, 255, 0.36);
  box-shadow:
    0 0 0 4px rgba(20, 99, 255, 0.08),
    0 12px 28px rgba(15, 23, 42, 0.08);
}

.xy-frontline-input--underline[data-state="focused"] :deep(.xy-input__wrapper) {
  box-shadow: 0 8px 20px rgba(20, 99, 255, 0.1);
}

.xy-frontline-input :deep(.xy-input__inner) {
  font-size: 15px;
}
</style>
