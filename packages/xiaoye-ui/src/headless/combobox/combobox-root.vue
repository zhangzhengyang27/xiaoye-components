<script setup lang="ts">
import { computed, inject, provide, ref, watch } from "vue";
import ListboxRoot from "../listbox/listbox-root.vue";
import type { ListboxOptionData, ListboxRootProps } from "../listbox/listbox-context";

export interface ComboboxOptionData extends ListboxOptionData {
  label?: string;
}

export interface ComboboxRootProps extends Omit<ListboxRootProps, "options"> {
  options?: ComboboxOptionData[];
  displayValue?: (option: ComboboxOptionData | null) => string;
}

const props = withDefaults(defineProps<ComboboxRootProps>(), {
  options: () => [],
  displayValue: (option: ComboboxOptionData | null) => option?.label ?? String(option?.value ?? "")
});

const emit = defineEmits<{
  "update:modelValue": [value: ComboboxOptionData | null];
  change: [value: ComboboxOptionData | null];
  search: [query: string];
}>();

const slots = defineSlots<{
  default?: () => unknown;
}>();

const query = ref("");
const isOpen = ref(false);

const displayText = computed(() => {
  const selected = inject<{ selectedOption: Ref<ComboboxOptionData | null> } | null>("xy-combobox-context", null);
  if (!selected) return "";
  return props.displayValue(selected.value?.selectedOption?.value ?? null);
});

function handleSearch(value: string) {
  query.value = value;
  emit("search", value);
}

const context = {
  query,
  displayText,
  handleSearch
};

provide("xy-combobox-context", context);

defineExpose({
  query
});
</script>

<template>
  <ListboxRoot v-bind="$attrs">
    <slot />
  </ListboxRoot>
</template>
