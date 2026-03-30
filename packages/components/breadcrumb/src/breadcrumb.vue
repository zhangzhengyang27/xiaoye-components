<script setup lang="ts">
defineOptions({
  name: "XyBreadcrumb",
  inheritAttrs: false
});

import { computed, provide, ref, useAttrs } from "vue";
import { useNamespace } from "@xiaoye/composables";
import BreadcrumbItem from "./breadcrumb-item.vue";
import type { BreadcrumbProps } from "./breadcrumb";
import { breadcrumbContextKey } from "./context";

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: "/",
  separatorIcon: "",
  ariaLabel: "面包屑",
  items: () => []
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
const normalizedItems = computed(() => props.items ?? []);

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
      <slot v-if="normalizedItems.length === 0" />
      <breadcrumb-item
        v-for="item in normalizedItems"
        v-else
        :key="`${item.label}-${item.href ?? ''}-${String(item.to ?? '')}`"
        :to="item.to"
        :replace="item.replace"
        :href="item.href"
        :target="item.target"
        :disabled="item.disabled"
      >
        {{ item.label }}
      </breadcrumb-item>
    </ol>
  </nav>
</template>
