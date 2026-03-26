<script setup lang="ts">
defineOptions({
  name: "XyDropdownMenu",
  inheritAttrs: false
});

import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { useDropdown } from "./use-dropdown";

defineProps<{}>();
defineSlots<{
  default?: () => unknown;
}>();

const attrs = useAttrs();
const dropdown = useDropdown();
const ns = useNamespace("dropdown");
const menuElementRef = ref<HTMLElement | null>(null);

const nativeAttrs = computed<Record<string, unknown>>(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  return rest;
});

const rootClasses = computed(() => [`${ns.base.value}__menu`, attrs.class]);

onMounted(() => {
  if (dropdown) {
    dropdown.menuRef.value = menuElementRef.value;
  }
});

onBeforeUnmount(() => {
  if (dropdown) {
    dropdown.menuRef.value = null;
  }
});
</script>

<template>
  <ul
    ref="menuElementRef"
    :class="rootClasses"
    :style="attrs.style"
    :role="dropdown?.role.value ?? 'menu'"
    :aria-labelledby="dropdown?.triggerId.value"
    tabindex="-1"
    v-bind="nativeAttrs"
    @keydown="dropdown?.handleMenuKeydown"
  >
    <slot />
  </ul>
</template>
