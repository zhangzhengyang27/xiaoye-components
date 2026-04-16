<script setup lang="ts">
import { computed, ref, useSlots, watch, watchEffect } from "vue";
import { XyDialog } from "@xiaoye/components";
import { isDev, warnOnce } from "@xiaoye/utils";
import type { FrontDialogProps } from "./dialog";

const props = withDefaults(defineProps<FrontDialogProps>(), {
  modelValue: false,
  title: "",
  description: "",
  size: "md",
  surface: "floating",
  dismissible: true,
  showClose: true
});
const slots = useSlots();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  openChange: [value: boolean];
}>();

const open = ref(props.modelValue);
const widthMap = {
  sm: 420,
  md: 560,
  lg: 720,
  xl: 920
} as const;

const dialogClass = computed(() => [
  "xy-frontline-theme",
  "xy-frontline-dialog",
  `xy-frontline-dialog--${props.surface}`
]);
const dialogState = computed(() => (open.value ? "open" : "closed"));

if (isDev()) {
  watchEffect(() => {
    if (slots.default && slots.content) {
      warnOnce("XyFrontDialog", "`content` slot 与默认 slot 同时存在时，默认 slot 会被忽略。后续请统一改用 `content`。");
    }
  });
}

watch(
  () => props.modelValue,
  (value) => {
    open.value = value;
  }
);

function updateOpen(value: boolean) {
  open.value = value;
  emit("update:modelValue", value);
  emit("openChange", value);
}
</script>

<template>
  <div
    class="xy-frontline-dialog-root"
    :data-slot="'root'"
    :data-state="dialogState"
    :data-surface="props.surface"
  >
    <XyDialog
      :model-value="props.modelValue"
      :class="dialogClass"
      :width="widthMap[props.size]"
      :show-close="props.showClose"
      :close-on-click-modal="props.dismissible"
      :close-on-press-escape="props.dismissible"
      align-center
      @update:model-value="updateOpen"
    >
      <template #header>
        <slot name="header" :state="dialogState" :close="() => updateOpen(false)">
          <div class="xy-frontline-dialog__header" data-slot="header">
            <div class="xy-frontline-dialog__eyebrow" data-slot="eyebrow">Frontline Dialog</div>
            <h3 class="xy-frontline-dialog__title" data-slot="title">{{ props.title }}</h3>
            <p
              v-if="props.description"
              class="xy-frontline-dialog__description"
              data-slot="description"
            >
              {{ props.description }}
            </p>
          </div>
        </slot>
      </template>
      <div class="xy-frontline-dialog__body" data-slot="body">
        <slot name="content" :state="dialogState" :close="() => updateOpen(false)">
          <slot :state="dialogState" :close="() => updateOpen(false)" />
        </slot>
      </div>
      <template v-if="$slots.footer" #footer>
        <div class="xy-frontline-dialog__footer" data-slot="footer">
          <slot name="footer" :state="dialogState" :close="() => updateOpen(false)" />
        </div>
      </template>
    </XyDialog>
  </div>
</template>

<style scoped>
.xy-frontline-dialog:deep(.xy-dialog__panel) {
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 32px;
  overflow: hidden;
}

.xy-frontline-dialog--floating:deep(.xy-dialog__panel) {
  background:
    radial-gradient(circle at top left, rgba(20, 99, 255, 0.1), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96));
  box-shadow: var(--xy-frontline-shadow-lg);
  backdrop-filter: blur(18px);
}

.xy-frontline-dialog__header {
  padding: 4px 0 2px;
}

.xy-frontline-dialog__eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--xy-frontline-brand-1);
}

.xy-frontline-dialog__title {
  margin: 10px 0 0;
  font-size: 28px;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--xy-frontline-neutral-1);
}

.xy-frontline-dialog__description {
  margin: 12px 0 0;
  color: var(--xy-frontline-neutral-3);
  font-size: 15px;
  line-height: 1.75;
}

.xy-frontline-dialog__body {
  color: var(--xy-frontline-neutral-2);
  font-size: 15px;
  line-height: 1.8;
}

.xy-frontline-dialog__footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
