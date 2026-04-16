<script setup lang="ts">
import { computed, ref, useSlots, watch, watchEffect } from "vue";
import { XyPopover } from "@xiaoye/components";
import { isDev, warnOnce } from "@xiaoye/utils";
import type { FrontPopoverProps } from "./popover";

const props = withDefaults(defineProps<FrontPopoverProps>(), {
  modelValue: false,
  title: "",
  content: "",
  placement: "bottom",
  width: 320,
  trigger: "click",
  surface: "default"
});
const slots = useSlots();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  openChange: [value: boolean];
}>();

const open = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    open.value = value;
  }
);

const rootClass = computed(() => [
  "xy-frontline-theme",
  "xy-frontline-popover",
  `xy-frontline-popover--${props.surface}`
]);
const hasSlotContent = computed(() => Boolean(slots.content || slots.default));
const popperClass = computed(() => [
  "xy-frontline-popover__panel",
  `xy-frontline-popover__panel--${props.surface}`
].join(" "));

if (isDev()) {
  watchEffect(() => {
    if (props.content && hasSlotContent.value) {
      warnOnce(
        "XyFrontPopover",
        "`content` prop 与 slot 同时存在时，`content` prop 会被忽略。结构化内容请统一改用 `content` slot。"
      );
    }

    if (slots.default && slots.content) {
      warnOnce("XyFrontPopover", "`content` slot 与默认 slot 同时存在时，默认 slot 会被忽略。后续请统一改用 `content`。");
    }
  });
}

function handleOpen() {
  open.value = true;
  emit("openChange", true);
}

function handleClose() {
  open.value = false;
  emit("openChange", false);
}

function handleUpdateModelValue(value: boolean) {
  open.value = value;
  emit("update:modelValue", value);
}
</script>

<template>
  <div
    :class="rootClass"
    :data-slot="'root'"
    :data-state="open ? 'open' : 'closed'"
    :data-surface="props.surface"
  >
    <XyPopover
      :model-value="props.modelValue"
      :title="props.title"
      :content="props.content"
      :placement="props.placement"
      :width="props.width"
      :trigger="props.trigger"
      :popper-class="popperClass"
      @update:model-value="handleUpdateModelValue"
      @open="handleOpen"
      @close="handleClose"
    >
      <template #reference>
        <slot name="trigger" :state="open ? 'open' : 'closed'" />
      </template>
      <template v-if="$slots.header" #header>
        <slot name="header" :state="open ? 'open' : 'closed'" />
      </template>
      <template v-if="$slots.content || $slots.default">
        <div class="xy-frontline-popover__content" data-slot="content">
          <slot name="content" :state="open ? 'open' : 'closed'">
            <slot :state="open ? 'open' : 'closed'" />
          </slot>
        </div>
      </template>
    </XyPopover>
  </div>
</template>

<style scoped>
.xy-frontline-popover :deep(.xy-frontline-popover__panel) {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--xy-frontline-shadow-md);
  backdrop-filter: blur(18px);
}

.xy-frontline-popover :deep(.xy-frontline-popover__panel--default) {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96));
}

.xy-frontline-popover :deep(.xy-frontline-popover__panel--highlight) {
  background:
    radial-gradient(circle at top left, rgba(20, 99, 255, 0.16), transparent 40%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(232, 241, 255, 0.98));
}

.xy-frontline-popover :deep(.xy-popover__header) {
  padding-bottom: 4px;
}

.xy-frontline-popover :deep(.xy-popover__body) {
  color: var(--xy-frontline-neutral-2);
  line-height: 1.75;
}

.xy-frontline-popover__content {
  display: grid;
  gap: 10px;
}
</style>
