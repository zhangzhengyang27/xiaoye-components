<script setup lang="ts">
import { computed } from "vue";
import type { CSSProperties } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { PageToolbarProps } from "./page-toolbar";

defineOptions({
  name: "XyPageToolbar"
});

const props = withDefaults(defineProps<PageToolbarProps>(), {
  title: "",
  description: "",
  divider: false,
  sticky: false,
  offsetTop: 0,
  bordered: false,
  style: undefined
});

const ns = useNamespace("page-toolbar");
const rootClasses = computed(() => [
  ns.base.value,
  props.bordered ? "is-bordered" : "",
  props.sticky ? "is-sticky" : ""
]);
const rootStyle = computed<CSSProperties>(() => ({
  ...(props.style ?? {}),
  ...(props.sticky
    ? {
        top: `${props.offsetTop}px`
      }
    : {})
}));
</script>

<template>
  <section :class="rootClasses" :style="rootStyle">
    <div class="xy-page-toolbar__header">
      <div class="xy-page-toolbar__heading">
        <slot name="title">
          <h2 v-if="props.title" class="xy-page-toolbar__title">{{ props.title }}</h2>
        </slot>
        <p v-if="props.description" class="xy-page-toolbar__description">{{ props.description }}</p>
      </div>
      <div v-if="$slots.actions" class="xy-page-toolbar__actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="$slots.default" :class="['xy-page-toolbar__content', props.divider ? 'is-divider' : '']">
      <slot />
    </div>
  </section>
</template>
