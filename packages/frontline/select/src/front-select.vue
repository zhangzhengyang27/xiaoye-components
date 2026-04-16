<script setup lang="ts">
import { computed, ref, useSlots, watchEffect } from "vue";
import { XyIcon, XySelect } from "@xiaoye/components";
import { isDev, warnOnce } from "@xiaoye/utils";
import type { FrontSelectProps } from "./select";

const props = withDefaults(defineProps<FrontSelectProps>(), {
  modelValue: null,
  placeholder: "选择一个方向",
  size: "md",
  variant: "default",
  clearable: false,
  searchable: false,
  leadingIcon: "",
  trailingIcon: "",
  prefixIcon: "",
  suffixIcon: ""
});
const slots = useSlots();

const emit = defineEmits<{
  "update:modelValue": [value: string | number | Array<string | number> | null];
  change: [value: string | number | Array<string | number> | null];
  openChange: [value: boolean];
  searchChange: [value: string];
}>();

const open = ref(false);
const selectClass = computed(() => [
  "xy-frontline-theme",
  "xy-frontline-select",
  `xy-frontline-select--${props.variant}`
]);
const valueState = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.length > 0 ? "filled" : "empty";
  }

  return props.modelValue == null || props.modelValue === "" ? "empty" : "filled";
});
const resolvedLeadingIcon = computed(() => props.leadingIcon || props.prefixIcon);
const resolvedTrailingIcon = computed(() => props.trailingIcon || props.suffixIcon);

if (isDev()) {
  watchEffect(() => {
    if (props.prefixIcon && !props.leadingIcon) {
      warnOnce("XyFrontSelect", "`prefixIcon` 已降级，后续请改用 `leadingIcon`。");
    }

    if (props.suffixIcon && !props.trailingIcon) {
      warnOnce("XyFrontSelect", "`suffixIcon` 已降级，后续请改用 `trailingIcon`。");
    }

    if (slots.prefix && !slots.leading) {
      warnOnce("XyFrontSelect", "`prefix` slot 已降级，后续请改用 `leading`。");
    }

    if (slots.suffix && !slots.trailing) {
      warnOnce("XyFrontSelect", "`suffix` slot 已降级，后续请改用 `trailing`。");
    }
  });
}
</script>

<template>
  <div
    :class="selectClass"
    :data-slot="'root'"
    :data-state="open ? 'open' : 'closed'"
    :data-value-state="valueState"
    :data-variant="props.variant"
    :data-size="props.size"
  >
    <XySelect
      :model-value="props.modelValue"
      :options="props.options"
      :placeholder="props.placeholder"
      :size="props.size"
      :clearable="props.clearable"
      :searchable="props.searchable"
      :data-slot="'trigger'"
      :data-state="open ? 'open' : 'closed'"
      :data-value-state="valueState"
      @update:model-value="emit('update:modelValue', $event)"
      @change="emit('change', $event)"
      @visible-change="
        open = $event;
        emit('openChange', $event);
      "
      @search-change="emit('searchChange', $event)"
    >
      <template v-if="resolvedLeadingIcon || $slots.leading || $slots.prefix" #prefix>
        <slot name="leading" :state="open ? 'open' : 'closed'">
          <slot name="prefix" :state="open ? 'open' : 'closed'">
            <XyIcon v-if="resolvedLeadingIcon" :icon="resolvedLeadingIcon" />
          </slot>
        </slot>
      </template>
      <template v-if="resolvedTrailingIcon || $slots.trailing || $slots.suffix" #suffix>
        <slot name="trailing" :state="open ? 'open' : 'closed'">
          <slot name="suffix" :state="open ? 'open' : 'closed'">
            <XyIcon v-if="resolvedTrailingIcon" :icon="resolvedTrailingIcon" />
          </slot>
        </slot>
      </template>
      <template v-if="$slots.header" #header>
        <slot name="header" :state="open ? 'open' : 'closed'" />
      </template>
      <template v-if="$slots.footer" #footer>
        <slot name="footer" :state="open ? 'open' : 'closed'" />
      </template>
    </XySelect>
  </div>
</template>

<style scoped>
.xy-frontline-select :deep(.xy-select__trigger) {
  border-radius: 22px;
  min-height: 48px;
  border-color: rgba(148, 163, 184, 0.2);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
}

.xy-frontline-select--soft :deep(.xy-select__trigger) {
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(241, 245, 249, 0.96));
}

.xy-frontline-select :deep(.xy-select__dropdown) {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--xy-frontline-shadow-md);
}

.xy-frontline-select[data-state="open"] :deep(.xy-select__trigger) {
  border-color: rgba(20, 99, 255, 0.38);
  box-shadow:
    0 0 0 4px rgba(20, 99, 255, 0.08),
    0 12px 28px rgba(15, 23, 42, 0.08);
}
</style>
