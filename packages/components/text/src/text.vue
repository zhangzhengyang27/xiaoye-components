<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, useAttrs } from "vue";
import type { CSSProperties } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import type { TextProps } from "./text";

const props = withDefaults(defineProps<TextProps>(), {
  type: "default",
  size: undefined,
  truncated: false,
  lineClamp: undefined,
  tag: "span"
});

const attrs = useAttrs();
const { size: globalSize } = useConfig();
const ns = useNamespace("text");
const textRef = ref<HTMLElement | null>(null);

const mergedSize = computed(() => props.size ?? globalSize.value);
const hasLineClamp = computed(
  () => props.lineClamp !== undefined && props.lineClamp !== null && `${props.lineClamp}` !== ""
);

const textKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.type}`,
  `${ns.base.value}--${mergedSize.value}`,
  ns.is("truncated", props.truncated),
  ns.is("line-clamp", hasLineClamp.value)
]);

const style = computed<CSSProperties>(() => ({
  WebkitLineClamp: hasLineClamp.value ? String(props.lineClamp) : undefined
}));

function bindTitle() {
  if (typeof attrs.title === "string" && attrs.title.length > 0) {
    return;
  }

  const element = textRef.value;

  if (!element) {
    return;
  }

  let shouldAddTitle = false;
  const text = element.textContent?.trim() ?? "";

  if (props.truncated) {
    shouldAddTitle = element.offsetWidth > 0 && element.scrollWidth > element.offsetWidth;
  } else if (hasLineClamp.value) {
    shouldAddTitle = element.offsetHeight > 0 && element.scrollHeight > element.offsetHeight;
  }

  if (shouldAddTitle && text) {
    element.setAttribute("title", text);
    return;
  }

  element.removeAttribute("title");
}

onMounted(bindTitle);
onUpdated(bindTitle);
</script>

<template>
  <component :is="props.tag" ref="textRef" :class="textKls" :style="style">
    <slot />
  </component>
</template>
