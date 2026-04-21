<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import type { Component } from "vue";

export interface ListboxOptionsProps {
  as?: string | Component;
  static?: boolean;
  unmount?: boolean;
}

const props = withDefaults(defineProps<ListboxOptionsProps>(), {
  as: "ul",
  static: false,
  unmount: true
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const listboxContext = inject<{
  listRef: Ref<HTMLElement | null>;
  isOpen: Ref<boolean>;
  floatingStyle: { value: Record<string, unknown> };
  zIndex: Ref<number>;
  navigation: {
    activeIndex: Ref<number>;
    setActiveIndex: (index: number) => void;
  };
} | null>("xy-listbox-context", null);

const listRef = computed({
  get: () => listboxContext?.listRef.value ?? null,
  set: (el) => {
    if (listboxContext?.listRef) {
      listboxContext.listRef.value = el;
    }
  }
});

const listStyle = computed(() => ({
  ...listboxContext?.floatingStyle.value,
  zIndex: listboxContext?.zIndex.value
}));

const isRendered = computed(() => props.static || listboxContext?.isOpen.value);
const isVisible = computed(() => !props.unmount || listboxContext?.isOpen.value);
</script>

<template>
  <component
    v-if="isVisible"
    :is="props.as"
    ref="listRef"
    :class="['xy-listbox__options', props.static ? 'xy-listbox__options--static' : '']"
    :style="listStyle"
    role="listbox"
  >
    <slot v-if="isRendered" />
  </component>
</template>
