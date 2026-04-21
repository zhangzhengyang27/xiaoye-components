<script setup lang="ts">
import { computed, inject } from "vue";
import type { Component } from "vue";

export interface TabPanelProps {
  as?: string | Component;
  static?: boolean;
}

const props = withDefaults(defineProps<TabPanelProps>(), {
  as: "div",
  static: false
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const tabGroupContext = inject<{
  selectedIndex: Ref<number>;
} | null>("xy-tab-group-context", null);

const index = ref(-1);
const panelId = computed(() => `xy-tab-panel-${index.value}`);
const tabId = computed(() => `xy-tab-${index.value}`);

const isSelected = computed(() => index.value === tabGroupContext?.selectedIndex.value);
</script>

<template>
  <component
    v-if="props.static || isSelected"
    :is="props.as"
    :id="panelId"
    :class="['xy-tab-panel', { 'is-selected': isSelected }]"
    role="tabpanel"
    :aria-labelledby="tabId"
    :tabindex="isSelected ? 0 : -1"
  >
    <slot />
  </component>
</template>
