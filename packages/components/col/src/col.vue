<script setup lang="ts">
import { computed, inject } from "vue";
import type { CSSProperties } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { rowContextKey } from "../../row/src/row";
import { colBreakpoints, colPositionProps } from "./col";
import type { ColBreakpoint, ColProps, ColSize, ColSizeObject, ColPositionProp } from "./col";

const props = withDefaults(defineProps<ColProps>(), {
  tag: "div",
  span: 24,
  offset: 0,
  pull: 0,
  push: 0
});

const ns = useNamespace("col");
const { gutter } = inject(rowContextKey, {
  gutter: computed(() => 0)
});

function isColSizeObject(value: ColSize | undefined): value is ColSizeObject {
  return value !== null && typeof value === "object";
}

function appendBaseClass(classes: string[], prop: ColPositionProp, value: number) {
  if (prop === "span") {
    classes.push(`${ns.base.value}-${value}`);
    return;
  }

  if (value > 0) {
    classes.push(`${ns.base.value}-${prop}-${value}`);
  }
}

function appendResponsiveClass(
  classes: string[],
  breakpoint: ColBreakpoint,
  size: ColSize | undefined
) {
  if (typeof size === "number") {
    classes.push(`${ns.base.value}-${breakpoint}-${size}`);
    return;
  }

  if (!isColSizeObject(size)) {
    return;
  }

  colPositionProps.forEach((prop) => {
    const value = size[prop];

    if (typeof value === "number") {
      classes.push(
        prop === "span"
          ? `${ns.base.value}-${breakpoint}-${value}`
          : `${ns.base.value}-${breakpoint}-${prop}-${value}`
      );
    }
  });
}

const colClasses = computed(() => {
  const classes = [ns.base.value];

  appendBaseClass(classes, "span", props.span);
  appendBaseClass(classes, "offset", props.offset);
  appendBaseClass(classes, "pull", props.pull);
  appendBaseClass(classes, "push", props.push);

  colBreakpoints.forEach((breakpoint) => {
    appendResponsiveClass(classes, breakpoint, props[breakpoint]);
  });

  if (gutter.value) {
    classes.push(ns.is("guttered", true));
  }

  return classes;
});

const style = computed<CSSProperties>(() => {
  const nextStyle: CSSProperties = {};

  if (gutter.value) {
    nextStyle.paddingLeft = `${gutter.value / 2}px`;
    nextStyle.paddingRight = `${gutter.value / 2}px`;
  }

  return nextStyle;
});
</script>

<template>
  <component :is="props.tag" :class="colClasses" :style="style">
    <slot />
  </component>
</template>
