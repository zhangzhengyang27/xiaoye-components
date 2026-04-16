<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { FrontTabsProps } from "./tabs";

const props = withDefaults(defineProps<FrontTabsProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  variant: "underline"
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

const tabsId = `xy-front-tabs-${Math.random().toString(36).slice(2, 10)}`;
const triggerRefs = ref<Array<HTMLButtonElement | null>>([]);
const current = ref("");
const firstEnabledKey = computed(() => props.items.find((item) => !item.disabled)?.key ?? "");
const selectedKey = computed(() => current.value || firstEnabledKey.value);
const tabsClass = computed(() => [
  "xy-frontline-theme",
  "xy-frontline-tabs",
  `xy-frontline-tabs--${props.variant}`
]);

function syncCurrent(value?: string) {
  const next = value ?? props.modelValue ?? props.defaultValue ?? current.value;
  const matched = props.items.some((item) => item.key === next && !item.disabled);
  current.value = matched ? next ?? "" : firstEnabledKey.value;
}

watch(
  () => props.modelValue,
  (value) => syncCurrent(value),
  {
    immediate: true
  }
);

watch(
  () => props.items,
  () => syncCurrent(props.modelValue ?? current.value),
  {
    deep: true
  }
);

function setTriggerRef(element: HTMLButtonElement | null, index: number) {
  triggerRefs.value[index] = element;
}

function focusTrigger(index: number) {
  triggerRefs.value[index]?.focus();
}

function activate(key: string) {
  if (key === current.value) {
    return;
  }

  current.value = key;
  emit("update:modelValue", key);
  emit("change", key);
}

function findEnabledIndex(startIndex: number, step: 1 | -1) {
  const total = props.items.length;

  if (!total) {
    return -1;
  }

  let index = startIndex;

  for (let count = 0; count < total; count += 1) {
    if (index < 0) {
      index = total - 1;
    } else if (index >= total) {
      index = 0;
    }

    if (!props.items[index]?.disabled) {
      return index;
    }

    index += step;
  }

  return -1;
}

function handleTriggerKeydown(event: KeyboardEvent, index: number) {
  let nextIndex = -1;

  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      event.preventDefault();
      nextIndex = findEnabledIndex(index + 1, 1);
      break;
    case "ArrowLeft":
    case "ArrowUp":
      event.preventDefault();
      nextIndex = findEnabledIndex(index - 1, -1);
      break;
    case "Home":
      event.preventDefault();
      nextIndex = findEnabledIndex(0, 1);
      break;
    case "End":
      event.preventDefault();
      nextIndex = findEnabledIndex(props.items.length - 1, -1);
      break;
    default:
      return;
  }

  if (nextIndex >= 0) {
    const nextItem = props.items[nextIndex];
    if (nextItem) {
      activate(nextItem.key);
      focusTrigger(nextIndex);
    }
  }
}
</script>

<template>
  <div
    :class="tabsClass"
    :data-slot="'root'"
    :data-state="'ready'"
    :data-variant="props.variant"
  >
    <div class="xy-frontline-tabs__list" role="tablist" aria-orientation="horizontal" data-slot="list">
      <button
        v-for="(item, index) in props.items"
        :id="`${tabsId}-trigger-${item.key}`"
        :key="item.key"
        :ref="(element) => setTriggerRef(element as HTMLButtonElement | null, index)"
        class="xy-frontline-tabs__trigger"
        type="button"
        role="tab"
        :disabled="item.disabled"
        :data-slot="'trigger'"
        :data-state="selectedKey === item.key ? 'active' : 'inactive'"
        :aria-selected="selectedKey === item.key"
        :aria-controls="`${tabsId}-content-${item.key}`"
        :tabindex="selectedKey === item.key ? 0 : -1"
        @click="activate(item.key)"
        @keydown="handleTriggerKeydown($event, index)"
      >
        <span class="xy-frontline-tabs__trigger-label">{{ item.label }}</span>
      </button>
    </div>

    <div
      v-for="item in props.items"
      :id="`${tabsId}-content-${item.key}`"
      :key="`${item.key}-panel`"
      class="xy-frontline-tabs__panel"
      role="tabpanel"
      :data-slot="'content'"
      :data-state="selectedKey === item.key ? 'active' : 'inactive'"
      :aria-labelledby="`${tabsId}-trigger-${item.key}`"
      v-show="selectedKey === item.key"
    >
      <slot :name="item.key" :selected="selectedKey === item.key">
        <div class="xy-frontline-tabs__panel-card">
          <strong>{{ item.label }}</strong>
          <p>当前实验线还在验证 anatomy 和状态暴露，这里先保留最小面板承载结构。</p>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.xy-frontline-tabs {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.xy-frontline-tabs__list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.xy-frontline-tabs__trigger {
  border: 0;
  background: transparent;
  padding: 10px 16px;
  border-radius: 999px;
  font: inherit;
  font-weight: 700;
  color: var(--xy-frontline-neutral-3);
  transition:
    color 0.22s ease,
    background-color 0.22s ease,
    box-shadow 0.22s ease;
}

.xy-frontline-tabs__trigger[data-state="active"] {
  color: var(--xy-frontline-neutral-1);
}

.xy-frontline-tabs--pill .xy-frontline-tabs__trigger[data-state="active"] {
  background: rgba(20, 99, 255, 0.1);
  color: var(--xy-frontline-brand-1);
}

.xy-frontline-tabs--segmented .xy-frontline-tabs__list {
  padding: 6px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.12);
}

.xy-frontline-tabs--segmented .xy-frontline-tabs__trigger[data-state="active"] {
  background: #fff;
  color: var(--xy-frontline-neutral-1);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.xy-frontline-tabs--underline .xy-frontline-tabs__trigger[data-state="active"] {
  background: rgba(20, 99, 255, 0.08);
  color: var(--xy-frontline-brand-1);
}

.xy-frontline-tabs__panel-card {
  padding: 20px 22px;
  border-radius: 24px;
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.14);
  color: var(--xy-frontline-neutral-2);
  line-height: 1.7;
}

.xy-frontline-tabs__panel-card strong {
  display: block;
  margin-bottom: 8px;
  color: var(--xy-frontline-neutral-1);
}
</style>
