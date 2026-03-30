<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, watch, useAttrs } from "vue";
import type { CSSProperties } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import type { TextProps } from "./text";

const props = withDefaults(defineProps<TextProps>(), {
  type: "default",
  size: undefined,
  truncated: false,
  lineClamp: undefined,
  tag: "span",
  copyable: false,
  ellipsisTooltip: false,
  expandable: false,
  strong: false,
  underline: false,
  delete: false
});

const attrs = useAttrs();
const { size: globalSize } = useConfig();
const ns = useNamespace("text");
const rootRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);
const hasOverflow = ref(false);
const expanded = ref(false);
const copied = ref(false);
let copiedTimer: number | null = null;

const mergedSize = computed(() => props.size ?? globalSize.value);
const hasLineClamp = computed(
  () => props.lineClamp !== undefined && props.lineClamp !== null && `${props.lineClamp}` !== ""
);
const isEllipsisEnabled = computed(() => !expanded.value && (props.truncated || hasLineClamp.value));
const showExpandButton = computed(() => props.expandable && (hasOverflow.value || expanded.value));

const textKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.type}`,
  `${ns.base.value}--${mergedSize.value}`,
  ns.is("truncated", props.truncated && !expanded.value),
  ns.is("line-clamp", hasLineClamp.value && !expanded.value),
  ns.is("strong", props.strong),
  ns.is("underline", props.underline),
  ns.is("delete", props.delete),
  ns.is("expanded", expanded.value)
]);

const style = computed<CSSProperties>(() => ({
  WebkitLineClamp: hasLineClamp.value && !expanded.value ? String(props.lineClamp) : undefined
}));

function bindTitle() {
  if (typeof attrs.title === "string" && attrs.title.length > 0) {
    hasOverflow.value = false;
    return;
  }

  const element = rootRef.value;
  const root = rootRef.value;
  const content = textRef.value;

  if (!element || !root || !content) {
    return;
  }

  let shouldAddTitle = false;
  const text = content.textContent?.trim() ?? "";

  if (props.truncated && !expanded.value) {
    shouldAddTitle = element.offsetWidth > 0 && element.scrollWidth > element.offsetWidth;
  } else if (hasLineClamp.value && !expanded.value) {
    shouldAddTitle = element.offsetHeight > 0 && element.scrollHeight > element.offsetHeight;
  }

  hasOverflow.value = shouldAddTitle;

  if (!isEllipsisEnabled.value && !props.ellipsisTooltip) {
    root.removeAttribute("title");
    return;
  }

  if (shouldAddTitle && text) {
    root.setAttribute("title", text);
    return;
  }

  root.removeAttribute("title");
}

onMounted(bindTitle);
onUpdated(bindTitle);

watch(
  () => [props.truncated, props.lineClamp, props.expandable, expanded.value],
  () => {
    bindTitle();
  }
);

async function handleCopy() {
  const text = textRef.value?.textContent?.trim() ?? "";

  if (!text) {
    return;
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  copied.value = true;

  if (copiedTimer !== null) {
    window.clearTimeout(copiedTimer);
  }

  copiedTimer = window.setTimeout(() => {
    copied.value = false;
    copiedTimer = null;
  }, 1200);
}

function toggleExpanded() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <component :is="props.tag" ref="rootRef" :class="textKls" :style="style">
    <span ref="textRef" class="xy-text__content">
      <slot />
    </span>
    <button
      v-if="props.copyable"
      type="button"
      class="xy-text__action"
      :aria-label="copied ? '已复制' : '复制内容'"
      @click="handleCopy"
    >
      <XyIcon :icon="copied ? 'mdi:check' : 'mdi:content-copy'" />
    </button>
    <button
      v-if="showExpandButton"
      type="button"
      class="xy-text__toggle"
      @click="toggleExpanded"
    >
      {{ expanded ? "收起" : "展开" }}
    </button>
  </component>
</template>
