<script setup lang="ts">
import { computed, useSlots } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import { XyLoadingIndicator, resolveLoadingVisualConfig } from "../../../components/loading/src/shared";
import { XyPageHeader } from "../../page-header";
import type { PageContainerProps } from "./page-container";

defineOptions({
  name: "XyPageContainer"
});

const props = withDefaults(defineProps<PageContainerProps>(), {
  title: "",
  description: "",
  metaItems: () => [],
  divider: false,
  bordered: true,
  loading: false,
  shadow: false,
  bodyClass: "",
  bodyStyle: undefined
});

const ns = useNamespace("page-container");
const slots = useSlots();
const { loading: globalLoading } = useConfig();
const rootClasses = computed(() => [
  ns.base.value,
  props.bordered ? "is-bordered" : "",
  props.shadow ? "is-shadow" : ""
]);
const showDefaultHeader = computed(
  () =>
    !slots.header &&
    (Boolean(props.title) ||
      Boolean(props.description) ||
      props.metaItems.length > 0 ||
      Boolean(slots.extra) ||
      Boolean(slots.actions))
);
const loadingVisual = computed(() =>
  resolveLoadingVisualConfig(globalLoading.value, "加载中...", false)
);
</script>

<template>
  <section :class="rootClasses">
    <slot v-if="$slots.header" name="header" />
    <xy-page-header
      v-else-if="showDefaultHeader"
      :title="props.title"
      :description="props.description"
      :meta-items="props.metaItems"
      :divider="props.divider"
      :bordered="false"
    >
      <template v-if="$slots.extra || $slots.actions" #actions>
        <slot name="actions">
          <slot name="extra" />
        </slot>
      </template>
      <template v-if="$slots.meta" #meta>
        <slot name="meta" />
      </template>
    </xy-page-header>

    <div :class="['xy-page-container__body', props.bodyClass]">
      <div v-if="props.loading" class="xy-page-container__loading">
        <xy-loading-indicator
          :text="loadingVisual.text"
          :spinner="loadingVisual.spinner"
          :svg="loadingVisual.svg"
          :svg-view-box="loadingVisual.svgViewBox"
          layout="stacked"
          size="md"
          surface
        />
      </div>
      <div v-else class="xy-page-container__body-inner" :style="props.bodyStyle">
        <slot />
      </div>
    </div>

    <footer v-if="$slots.footer" class="xy-page-container__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
