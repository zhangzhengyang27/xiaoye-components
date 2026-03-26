<script setup lang="ts">
defineOptions({
  name: "XyBreadcrumbItem",
  inheritAttrs: false
});

import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, useAttrs } from "vue";
import type { AnchorHTMLAttributes } from "vue";
import { useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import type { BreadcrumbItemProps } from "./breadcrumb-item";
import { breadcrumbContextKey } from "./context";

type RouterLike = {
  push?: (target: unknown) => unknown;
  replace?: (target: unknown) => unknown;
};

const props = withDefaults(defineProps<BreadcrumbItemProps>(), {
  to: "",
  replace: false,
  href: "",
  target: "_self",
  disabled: false
});

const attrs = useAttrs();
const ns = useNamespace("breadcrumb");
const instance = getCurrentInstance();
const uid = instance?.uid ?? Math.random();
const breadcrumbContext = inject(breadcrumbContextKey, null);
const router = instance?.appContext.config.globalProperties.$router as RouterLike | undefined;

onMounted(() => {
  breadcrumbContext?.registerItem(uid);
});

onBeforeUnmount(() => {
  breadcrumbContext?.unregisterItem(uid);
});

const nativeAttrs = computed<Record<string, unknown>>(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  return rest;
});

const rootTag = computed(() => (breadcrumbContext ? "li" : "span"));
const isLast = computed(() => breadcrumbContext?.isLast(uid) ?? false);
const hasRouter = computed(
  () => Boolean(router && typeof router.push === "function" && typeof router.replace === "function")
);
const hasTo = computed(() => props.to !== "" && props.to !== undefined);
const hasHref = computed(() => Boolean(props.href));
const usesRouterNavigation = computed(() => hasTo.value && hasRouter.value);
const usesHrefNavigation = computed(
  () => !usesRouterNavigation.value && hasHref.value && !props.disabled && !isLast.value
);
const hasActionIntent = computed(
  () => !props.disabled && !isLast.value && (hasHref.value || hasTo.value)
);
const isClickable = computed(
  () => !props.disabled && !isLast.value && (usesRouterNavigation.value || usesHrefNavigation.value)
);
const rootClasses = computed(() => [
  `${ns.base.value}__item`,
  {
    "is-current": isLast.value,
    "is-disabled": props.disabled
  },
  attrs.class
]);
const innerClasses = computed(() => [
  `${ns.base.value}__inner`,
  {
    "is-link": hasActionIntent.value
  }
]);
const innerTag = computed(() => (usesHrefNavigation.value ? "a" : "span"));
const innerAttrs = computed<AnchorHTMLAttributes & Record<string, unknown>>(() => ({
  href: usesHrefNavigation.value ? props.href : undefined,
  target: usesHrefNavigation.value ? props.target : undefined,
  role: isClickable.value && !usesHrefNavigation.value ? "link" : undefined,
  tabindex: isClickable.value && !usesHrefNavigation.value ? 0 : undefined,
  "aria-disabled": props.disabled ? "true" : undefined
}));

function handleClick(event: MouseEvent) {
  if (!isClickable.value) {
    event.preventDefault();
    return;
  }

  if (!usesRouterNavigation.value) {
    return;
  }

  event.preventDefault();
  props.replace ? router?.replace?.(props.to) : router?.push?.(props.to);
}

function handleKeydown(event: KeyboardEvent) {
  if (!isClickable.value || usesHrefNavigation.value || event.key !== "Enter") {
    return;
  }

  event.preventDefault();
  (event.currentTarget as HTMLElement | null)?.click();
}
</script>

<template>
  <component
    :is="rootTag"
    :class="rootClasses"
    :style="attrs.style"
    :aria-current="isLast ? 'page' : undefined"
    v-bind="nativeAttrs"
  >
    <component
      :is="innerTag"
      :class="innerClasses"
      v-bind="innerAttrs"
      @click="handleClick"
      @keydown="handleKeydown"
    >
      <slot />
    </component>

    <span
      v-if="breadcrumbContext && !isLast"
      class="xy-breadcrumb__separator"
      role="presentation"
      aria-hidden="true"
    >
      <XyIcon
        v-if="breadcrumbContext.separatorIcon.value"
        class="xy-breadcrumb__separator-icon"
        :icon="breadcrumbContext.separatorIcon.value"
        :size="14"
      />
      <template v-else>
        {{ breadcrumbContext.separator.value }}
      </template>
    </span>
  </component>
</template>
