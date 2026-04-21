<script setup lang="ts">
import { computed, provide, ref, watch } from "vue";
import type { Component } from "vue";

export interface TabData {
  id: string;
  [key: string]: unknown;
}

export interface TabGroupRootProps {
  selectedIndex?: number;
  as?: string | Component;
}

const props = withDefaults(defineProps<TabGroupRootProps>(), {
  selectedIndex: 0,
  as: "div"
});

const emit = defineEmits<{
  "update:selectedIndex": [index: number];
  change: [index: number];
}>();

const slots = defineSlots<{
  default?: () => unknown;
}>();

const selectedIndex = ref(props.selectedIndex);
const tabs = ref<TabData[]>([]);

watch(
  () => props.selectedIndex,
  (val) => {
    selectedIndex.value = val;
  }
);

function registerTab(tab: TabData) {
  tabs.value.push(tab);
}

function unregisterTab(id: string) {
  const index = tabs.value.findIndex((t) => t.id === id);
  if (index > -1) {
    tabs.value.splice(index, 1);
  }
}

function selectTab(index: number) {
  if (index < 0 || index >= tabs.value.length) return;
  selectedIndex.value = index;
  emit("update:selectedIndex", index);
  emit("change", index);
}

const context = {
  selectedIndex,
  tabs,
  registerTab,
  unregisterTab,
  selectTab
};

provide("xy-tab-group-context", context);

defineExpose({
  selectTab
});
</script>

<template>
  <component :is="props.as" class="xy-tab-group">
    <slot />
  </component>
</template>
