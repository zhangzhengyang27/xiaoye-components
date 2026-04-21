<script setup lang="ts">
import { computed, inject } from "vue";
import type { Component } from "vue";

export interface ListboxButtonProps {
  as?: string | Component;
}

const props = withDefaults(defineProps<ListboxButtonProps>(), {
  as: "button"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const listboxContext = inject<{
  buttonRef: Ref<HTMLElement | null>;
  isOpen: Ref<boolean>;
  toggle: () => void;
  selectedOption: Ref<{ value: string | number; disabled?: boolean } | null>;
} | null>("xy-listbox-context", null);

const buttonRef = computed({
  get: () => listboxContext?.buttonRef.value ?? null,
  set: (el) => {
    if (listboxContext?.buttonRef) {
      listboxContext.buttonRef.value = el;
    }
  }
});

function handleClick() {
  listboxContext?.toggle();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    listboxContext?.open();
  }
}
</script>

<template>
  <component
    :is="props.as"
    ref="buttonRef"
    class="xy-listbox__button"
    :aria-expanded="listboxContext?.isOpen.value ?? false"
    aria-haspopup="listbox"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot>{{ listboxContext?.selectedOption.value?.value ?? "Select..." }}</slot>
  </component>
</template>
