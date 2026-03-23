<script setup lang="ts">
import { computed, useAttrs, useSlots } from "vue";
import type { AnchorHTMLAttributes } from "vue";
import { useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import type { LinkProps, LinkUnderlineMode } from "./link";

const props = withDefaults(defineProps<LinkProps>(), {
  type: "default",
  underline: "hover",
  disabled: false,
  href: "",
  target: "_self"
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

defineSlots<{
  default?: () => unknown;
  icon?: () => unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();
const ns = useNamespace("link");

const hasHref = computed(() => Boolean(props.href));
const isFocusableAction = computed(() => !props.disabled && !hasHref.value);
const hasDefaultSlot = computed(() => Boolean(slots.default));

const underline = computed<LinkUnderlineMode>(() => {
  if (props.underline === true) {
    return "hover";
  }

  if (props.underline === false) {
    return "never";
  }

  return props.underline;
});

const resolvedRole = computed(() => {
  if (!hasHref.value) {
    return "link";
  }

  return typeof attrs.role === "string" ? attrs.role : undefined;
});

const resolvedTabindex = computed(() => {
  if (props.disabled) {
    return -1;
  }

  const tabindex = attrs.tabindex;

  if (typeof tabindex === "string" || typeof tabindex === "number") {
    return tabindex;
  }

  return isFocusableAction.value ? 0 : undefined;
});

const linkKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.type}`,
  ns.is("disabled", props.disabled),
  ns.is("underline", underline.value === "always"),
  ns.is("hover-underline", underline.value === "hover" && !props.disabled),
  ns.is("icon-only", !hasDefaultSlot.value)
]);

const linkAttrs = computed<AnchorHTMLAttributes & Record<string, unknown>>(() => ({
  ...attrs,
  href: props.disabled || !hasHref.value ? undefined : props.href,
  target: props.disabled || !hasHref.value ? undefined : props.target,
  role: resolvedRole.value,
  tabindex: resolvedTabindex.value,
  "aria-disabled": props.disabled ? "true" : undefined
}));

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  emit("click", event);
}

function handleKeydown(event: KeyboardEvent) {
  if (!isFocusableAction.value || event.key !== "Enter") {
    return;
  }

  event.preventDefault();
  (event.currentTarget as HTMLAnchorElement | null)?.click();
}
</script>

<template>
  <a :class="linkKls" v-bind="linkAttrs" @click="handleClick" @keydown="handleKeydown">
    <span v-if="props.icon" class="xy-link__icon" aria-hidden="true">
      <XyIcon :icon="props.icon" :size="14" />
    </span>
    <span v-if="$slots.default" class="xy-link__inner">
      <slot />
    </span>
    <span v-if="$slots.icon" class="xy-link__icon xy-link__icon--suffix" aria-hidden="true">
      <slot name="icon" />
    </span>
  </a>
</template>
