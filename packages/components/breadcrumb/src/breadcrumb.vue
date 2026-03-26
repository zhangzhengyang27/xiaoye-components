<script setup lang="ts">
defineOptions({
  name: "XyBreadcrumb",
  inheritAttrs: false
});

import { computed, provide, ref, useAttrs } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { BreadcrumbProps } from "./breadcrumb";
import { breadcrumbContextKey } from "./context";

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: "/",
  separatorIcon: "",
  ariaLabel: "面包屑"
});

const attrs = useAttrs();
const ns = useNamespace("breadcrumb");
const itemUids = ref<number[]>([]);

const nativeAttrs = computed<Record<string, unknown>>(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  return rest;
});

const rootClasses = computed(() => [ns.base.value, attrs.class]);
const separator = computed(() => props.separator);
const separatorIcon = computed(() => props.separatorIcon);

function registerItem(uid: number) {
  if (!itemUids.value.includes(uid)) {
    itemUids.value = [...itemUids.value, uid];
  }
}

function unregisterItem(uid: number) {
  itemUids.value = itemUids.value.filter((current) => current !== uid);
}

function isLast(uid: number) {
  return itemUids.value.at(-1) === uid;
}

provide(breadcrumbContextKey, {
  separator,
  separatorIcon,
  registerItem,
  unregisterItem,
  isLast
});
</script>

<template>
  <nav
    :class="rootClasses"
    :style="attrs.style"
    role="navigation"
    :aria-label="props.ariaLabel"
    v-bind="nativeAttrs"
  >
    <ol class="xy-breadcrumb__list">
      <slot />
    </ol>
  </nav>
</template>
