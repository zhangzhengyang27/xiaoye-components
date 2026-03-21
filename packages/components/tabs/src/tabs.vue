<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { ComponentPublicInstance } from "vue";
import { useNamespace } from "@xiaoye/composables";

export interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  modelValue?: string;
  items: TabItem[];
}

const props = defineProps<TabsProps>();
const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

const ns = useNamespace("tabs");
const tabsId = `xy-tabs-${Math.random().toString(36).slice(2, 10)}`;
const tabRefs = ref<Array<HTMLButtonElement | null>>([]);
const current = ref("");

const firstEnabledKey = computed(() => props.items.find((item) => !item.disabled)?.key ?? "");
const activeItem = computed(() => props.items.find((item) => item.key === current.value));

function syncCurrent(value?: string) {
  const nextValue = value ?? current.value;
  const matched = props.items.some((item) => item.key === nextValue && !item.disabled);

  current.value = matched ? nextValue : firstEnabledKey.value;
}

watch(
  () => props.modelValue,
  (value) => {
    syncCurrent(value);
  },
  {
    immediate: true
  }
);

watch(
  () => props.items,
  () => {
    syncCurrent(props.modelValue ?? current.value);
  },
  {
    deep: true
  }
);

function activate(item: TabItem) {
  if (item.disabled) {
    return;
  }

  current.value = item.key;
  emit("update:modelValue", item.key);
  emit("change", item.key);
}

function setTabRef(element: Element | ComponentPublicInstance | null, index: number) {
  tabRefs.value[index] = element as HTMLButtonElement | null;
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

function focusTab(index: number) {
  tabRefs.value[index]?.focus();
}

function activateByIndex(index: number) {
  const item = props.items[index];

  if (!item || item.disabled) {
    return;
  }

  activate(item);
  focusTab(index);
}

function handleKeydown(event: KeyboardEvent, index: number) {
  let targetIndex = -1;

  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      event.preventDefault();
      targetIndex = findEnabledIndex(index + 1, 1);
      break;
    case "ArrowLeft":
    case "ArrowUp":
      event.preventDefault();
      targetIndex = findEnabledIndex(index - 1, -1);
      break;
    case "Home":
      event.preventDefault();
      targetIndex = findEnabledIndex(0, 1);
      break;
    case "End":
      event.preventDefault();
      targetIndex = findEnabledIndex(props.items.length - 1, -1);
      break;
    default:
      return;
  }

  if (targetIndex >= 0) {
    activateByIndex(targetIndex);
  }
}
</script>

<template>
  <div :class="ns.base.value">
    <div class="xy-tabs__nav" role="tablist" aria-orientation="horizontal">
      <button
        v-for="(item, index) in props.items"
        :id="`${tabsId}-tab-${item.key}`"
        :key="item.key"
        :ref="(element) => setTabRef(element, index)"
        type="button"
        role="tab"
        :disabled="item.disabled"
        :tabindex="item.key === current ? 0 : -1"
        :aria-selected="item.key === current"
        :aria-controls="`${tabsId}-panel-${item.key}`"
        :class="[
          'xy-tabs__tab',
          item.key === current ? 'is-active' : '',
          item.disabled ? 'is-disabled' : ''
        ]"
        @click="activate(item)"
        @keydown="handleKeydown($event, index)"
      >
        {{ item.label }}
      </button>
    </div>
    <div
      :id="`${tabsId}-panel-${activeItem?.key ?? 'empty'}`"
      role="tabpanel"
      class="xy-tabs__panel"
      :aria-labelledby="activeItem ? `${tabsId}-tab-${activeItem.key}` : undefined"
      tabindex="0"
    >
      <slot :active-key="current" :active-item="activeItem">
        {{ activeItem?.label }}
      </slot>
    </div>
  </div>
</template>
