<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount } from "vue";
import type { TabPaneProps } from "./tabs";

const props = withDefaults(defineProps<TabPaneProps>(), {
  disabled: false,
  closable: false,
  lazy: false
});

const tabs = inject<{
  activeName: { value: string };
  addTab: (tab: { name: string; label: string; disabled?: boolean; closable?: boolean }) => void;
  removeTab: (name: string) => void;
}>("xyuTabs" as symbol, {
  activeName: { value: "" },
  addTab: () => {},
  removeTab: () => {}
});

onMounted(() => {
  tabs.addTab({
    name: props.name,
    label: props.label,
    disabled: props.disabled,
    closable: props.closable
  });
});

onBeforeUnmount(() => {
  tabs.removeTab(props.name);
});
</script>

<template>
  <div
    v-show="tabs.activeName.value === props.name"
    :class="'xyu-tab-pane'"
    role="tabpanel"
  >
    <slot />
  </div>
</template>
