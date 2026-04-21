<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from "vue";
import type { Component } from "vue";

export interface TabProps {
  id?: string;
  disabled?: boolean;
  as?: string | Component;
}

const props = withDefaults(defineProps<TabProps>(), {
  id: undefined,
  disabled: false,
  as: "button"
});

const slots = defineSlots<{
  default?: (props: { selected: boolean }) => unknown;
}>();

const tabGroupContext = inject<{
  selectedIndex: Ref<number>;
  registerTab: (tab: { id: string }) => void;
  unregisterTab: (id: string) => void;
  selectTab: (index: number) => void;
} | null>("xy-tab-group-context", null);

const tabId = ref(props.id || `xy-tab-${Math.random().toString(36).slice(2, 9)}`);
const index = ref(-1);

onMounted(() => {
  const idx = tabGroupContext?.tabs.value.findIndex((t) => t.id === tabId.value) ?? -1;
  index.value = idx;

  tabGroupContext?.registerTab({ id: tabId.value });
});

onBeforeUnmount(() => {
  tabGroupContext?.unregisterTab(tabId.value);
});

const isSelected = computed(() => index.value === tabGroupContext?.selectedIndex.value);

function handleClick() {
  if (props.disabled) return;
  tabGroupContext?.selectTab(index.value);
}
</script>

<template>
  <component
    :is="props.as"
    :id="tabId"
    :class="['xy-tab', { 'is-selected': isSelected, 'is-disabled': props.disabled }]"
    :aria-selected="isSelected"
    :aria-disabled="props.disabled"
    role="tab"
    :tabindex="isSelected ? 0 : -1"
    @click="handleClick"
  >
    <slot :selected="isSelected" />
  </component>
</template>
