<script setup lang="ts">
import { computed, inject } from "vue";
import type { Component } from "vue";
import type { ListboxOptionData } from "./listbox-root.vue";

export interface ListboxOptionProps {
  value: string | number | ListboxOptionData;
  disabled?: boolean;
  as?: string | Component;
}

const props = withDefaults(defineProps<ListboxOptionProps>(), {
  disabled: false,
  as: "li"
});

const slots = defineSlots<{
  default?: (props: { active: boolean; selected: boolean; disabled: boolean }) => unknown;
}>();

const listboxContext = inject<{
  selectedValue: Ref<string | number | null>;
  activeOption: Ref<ListboxOptionData | null>;
  navigation: {
    activeIndex: Ref<number>;
    setActiveIndex: (index: number) => void;
  };
  selectOption: (option: ListboxOptionData) => void;
} | null>("xy-listbox-context", null);

const optionData = computed<ListboxOptionData>(() => {
  if (typeof props.value === "object" && "value" in props.value) {
    return props.value as ListboxOptionData;
  }
  return { value: props.value, disabled: props.disabled };
});

const isSelected = computed(() => {
  const val = optionData.value.value;
  return listboxContext?.selectedValue.value === val;
});

const isActive = computed(() => {
  const active = listboxContext?.activeOption.value;
  if (!active) return false;
  return active.value === optionData.value.value;
});

const mergedDisabled = computed(() => optionData.value.disabled || props.disabled);

function handleClick() {
  if (mergedDisabled.value) return;
  listboxContext?.selectOption(optionData.value);
}

function handleMouseEnter() {
  const idx = optionData.value._index;
  if (idx !== undefined) {
    listboxContext?.navigation.setActiveIndex(idx);
  }
}
</script>

<template>
  <component
    :is="props.as"
    :class="[
      'xy-listbox__option',
      {
        'is-active': isActive,
        'is-selected': isSelected,
        'is-disabled': mergedDisabled
      }
    ]"
    :aria-selected="isSelected"
    :aria-disabled="mergedDisabled"
    role="option"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
  >
    <slot :active="isActive" :selected="isSelected" :disabled="mergedDisabled" />
  </component>
</template>
