<script setup lang="ts">
import { computed } from "vue";
import type { SpaceProps } from "./space";

const props = withDefaults(defineProps<SpaceProps>(), {
  size: "md",
  direction: "horizontal",
  alignment: "center",
  wrap: false,
  fill: false,
  prefixCls: "xyu-space"
});

const ns = props.prefixCls;

const gapValue = computed(() => {
  const { size } = props;
  if (Array.isArray(size)) {
    const [w, h] = size.map((s) => (typeof s === "number" ? `${s}px` : `var(--xyu-space-${s})`));
    return `${h} ${w}`;
  }
  if (typeof size === "number") return `${size}px`;
  return `var(--xyu-space-${size})`;
});

const spaceClasses = computed(() => [
  ns,
  `${ns}--${props.direction}`,
  props.wrap ? "is-wrap" : "",
  props.fill ? "is-fill" : ""
]);

const containerStyle = computed(() => ({
  gap: gapValue.value,
  alignItems: props.alignment,
  justifyContent: props.justify
}));

const itemStyle = computed(() => {
  if (props.fill) {
    return {
      flex: 1,
      minWidth: 0
    };
  }
  return {};
});
</script>

<template>
  <div :class="spaceClasses" :style="containerStyle">
    <div
      v-for="(item, index) in ($slots.default?.() ?? [])"
      :key="index"
      :class="`${ns}__item`"
      :style="itemStyle"
    >
      <component
        :is="typeof item.type === 'object' && (item.type as VNode).type === props.prefixCls
          ? item
          : item"
      />
    </div>
  </div>
</template>
