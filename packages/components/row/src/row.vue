<script setup lang="ts">
import { computed, provide } from "vue";
import type { CSSProperties } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { RowProps } from "./row";
import { rowContextKey } from "./row";

const props = withDefaults(defineProps<RowProps>(), {
  tag: "div",
  gutter: 0,
  justify: "start"
});

const ns = useNamespace("row");
const gutter = computed(() => props.gutter);

provide(rowContextKey, {
  gutter
});

const style = computed<CSSProperties>(() => {
  if (!props.gutter) {
    return {};
  }

  const halfGutter = props.gutter / 2;

  return {
    marginLeft: `-${halfGutter}px`,
    marginRight: `-${halfGutter}px`
  };
});

const rowClasses = computed(() => [
  ns.base.value,
  props.justify !== "start" ? ns.is(`justify-${props.justify}`, true) : "",
  props.align ? ns.is(`align-${props.align}`, true) : ""
]);
</script>

<template>
  <component :is="props.tag" :class="rowClasses" :style="style">
    <slot />
  </component>
</template>
