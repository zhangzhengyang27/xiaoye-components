<script setup lang="ts">
import { computed, inject } from "vue";
import ListboxButton from "../listbox/listbox-button.vue";

const slots = defineSlots<{
  default?: () => unknown;
}>();

const comboboxContext = inject<{
  query: Ref<string>;
  displayText: Ref<string>;
  handleSearch: (query: string) => void;
} | null>("xy-combobox-context", null);
</script>

<template>
  <ListboxButton as="div" class="xy-combobox__input-wrapper">
    <input
      :value="comboboxContext?.query.value"
      class="xy-combobox__input"
      type="text"
      @input="(e) => comboboxContext?.handleSearch((e.target as HTMLInputElement).value)"
    />
    <slot>{{ comboboxContext?.displayText.value }}</slot>
  </ListboxButton>
</template>
