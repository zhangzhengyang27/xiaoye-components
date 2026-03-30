<script setup lang="ts">
import { computed } from "vue";
import { XySplitter, XySplitterPanel } from "@xiaoye/components";
import type { SplitLayoutPageProps } from "./split-layout-page";

defineOptions({
  name: "XySplitLayoutPage"
});

const props = withDefaults(defineProps<SplitLayoutPageProps>(), {
  title: "",
  description: "",
  layout: "aside-main",
  primarySize: ""
});

const resolvedPrimarySize = computed(() => {
  if (props.primarySize) {
    return props.primarySize;
  }

  return props.layout === "master-detail" ? "38%" : "28%";
});

const primarySlotName = computed(() => (props.layout === "master-detail" ? "master" : "aside"));
const secondarySlotName = computed(() => (props.layout === "master-detail" ? "detail" : "main"));
</script>

<template>
  <div class="xy-split-layout-page">
    <div class="xy-split-layout-page__header">
      <div class="xy-split-layout-page__header-main">
        <div class="xy-split-layout-page__header-heading">
          <h2 v-if="props.title" class="xy-split-layout-page__header-title">{{ props.title }}</h2>
          <p v-if="props.description" class="xy-split-layout-page__header-description">
            {{ props.description }}
          </p>
        </div>
      </div>
    </div>
    <xy-splitter>
      <xy-splitter-panel :size="resolvedPrimarySize">
        <div class="xy-split-layout-page__panel">
          <slot :name="primarySlotName" />
        </div>
      </xy-splitter-panel>
      <xy-splitter-panel>
        <div class="xy-split-layout-page__panel">
          <slot :name="secondarySlotName" />
        </div>
      </xy-splitter-panel>
    </xy-splitter>
  </div>
</template>
