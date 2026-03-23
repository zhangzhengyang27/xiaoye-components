<script setup lang="ts">
import { computed, getCurrentInstance, inject, onBeforeUnmount, ref } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { SplitterPanelProps } from "./split-panel";
import { splitterContextKey } from "./context";
import SplitBar from "./split-bar.vue";

const props = withDefaults(defineProps<SplitterPanelProps>(), {
  resizable: true,
  collapsible: false
});

const emit = defineEmits<{
  "update:size": [value: number];
}>();

const ns = useNamespace("splitter-panel");
const splitter = inject(splitterContextKey, null);

if (!splitter) {
  throw new Error("xy-splitter-panel 必须在 xy-splitter 内使用");
}

const index = ref(-1);
const uid = getCurrentInstance()?.uid ?? Date.now();

splitter.registerPanel({
  uid,
  get size() {
    return props.size;
  },
  get min() {
    return props.min;
  },
  get max() {
    return props.max;
  },
  get resizable() {
    return props.resizable;
  },
  get collapsible() {
    return props.collapsible;
  },
  emitSizeUpdate(value) {
    emit("update:size", value);
  },
  setIndex(value) {
    index.value = value;
  }
});

onBeforeUnmount(() => {
  splitter.unregisterPanel(uid);
});

const panelSize = computed(() => splitter.getPanelSize(index.value));
const nextPanel = computed(() => splitter.getPanel(index.value + 1));
const showBar = computed(() => Boolean(nextPanel.value));
const canResize = computed(() => Boolean(props.resizable && nextPanel.value?.resizable));
const isActiveBar = computed(() => splitter.movingIndex.value === index.value);
const panelStyle = computed(() => ({
  flexBasis: `${panelSize.value}px`
}));
</script>

<template>
  <div :class="ns.base.value" :style="panelStyle">
    <slot />
  </div>

  <SplitBar
    v-if="showBar"
    :index="index"
    :layout="splitter.layout.value"
    :lazy="splitter.lazy.value"
    :resizable="canResize"
    :active="isActiveBar"
    :active-offset="splitter.previewOffset.value"
    :start-collapsible="Boolean(props.collapsible)"
    :end-collapsible="Boolean(nextPanel?.collapsible)"
    @move-start="splitter.onResizeStart"
    @moving="splitter.onResize"
    @move-end="splitter.onResizeEnd"
    @collapse="splitter.onCollapse"
  />
</template>
