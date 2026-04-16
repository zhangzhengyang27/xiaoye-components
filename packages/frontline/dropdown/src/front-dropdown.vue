<script setup lang="ts">
import { computed, ref, useSlots, watch, watchEffect } from "vue";
import { XyDropdown } from "@xiaoye/components";
import { isDev, warnOnce } from "@xiaoye/utils";
import type { FrontDropdownProps } from "./dropdown";

const props = withDefaults(defineProps<FrontDropdownProps>(), {
  modelValue: false,
  items: () => [],
  trigger: "click",
  placement: "bottom-end",
  title: "",
  surface: "default"
});
const slots = useSlots();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  command: [command: string | number | Record<string, unknown> | undefined];
  openChange: [value: boolean];
  select: [item: unknown];
}>();

const open = ref(props.modelValue);
const rootClass = computed(() => [
  "xy-frontline-theme",
  "xy-frontline-dropdown",
  `xy-frontline-dropdown--${props.surface}`
]);

watch(
  () => props.modelValue,
  (value) => {
    open.value = value;
  }
);

if (isDev()) {
  watchEffect(() => {
    if (slots.default && slots.trigger) {
      warnOnce("XyFrontDropdown", "`trigger` slot 与默认 slot 同时存在时，默认 slot 会被忽略。后续请统一改用 `trigger`。");
    }

    if (slots.dropdown && slots.content) {
      warnOnce("XyFrontDropdown", "`dropdown` slot 与 `content` slot 同时存在时，`dropdown` slot 会被忽略。后续请统一改用 `content`。");
    } else if (slots.dropdown && !slots.content) {
      warnOnce("XyFrontDropdown", "`dropdown` slot 已降级，后续请改用 `content`。");
    }
  });
}

function handleVisibleChange(value: boolean) {
  open.value = value;
  emit("update:modelValue", value);
  emit("openChange", value);
}
</script>

<template>
  <div
    :class="rootClass"
    :data-slot="'root'"
    :data-state="open ? 'open' : 'closed'"
    :data-surface="props.surface"
  >
    <XyDropdown
      :model-value="props.modelValue"
      :items="props.items"
      :trigger="props.trigger"
      :placement="props.placement"
      :popper-class="'xy-frontline-dropdown__menu'"
      @visible-change="handleVisibleChange"
      @command="emit('command', $event)"
      @select="emit('select', $event)"
    >
      <slot name="trigger" :state="open ? 'open' : 'closed'">
        <slot :state="open ? 'open' : 'closed'" />
      </slot>
      <template v-if="$slots.dropdown || $slots.content" #dropdown>
        <slot name="content" :state="open ? 'open' : 'closed'">
          <slot name="dropdown" :state="open ? 'open' : 'closed'" />
        </slot>
      </template>
    </XyDropdown>
  </div>
</template>

<style scoped>
.xy-frontline-dropdown :deep(.xy-frontline-dropdown__menu) {
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96));
  box-shadow: var(--xy-frontline-shadow-md);
  overflow: hidden;
}

.xy-frontline-dropdown--highlight :deep(.xy-frontline-dropdown__menu) {
  background:
    radial-gradient(circle at top left, rgba(20, 99, 255, 0.14), transparent 40%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(232, 241, 255, 0.96));
}

.xy-frontline-dropdown :deep(.xy-dropdown__item) {
  border-radius: 16px;
  margin: 4px 6px;
}
</style>
