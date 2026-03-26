<script setup lang="ts">
import XyIcon from "../../icon";
import type { TableFilterOption, TableFilterValue } from "./table";

const props = withDefaults(defineProps<{
  title?: string;
  options?: TableFilterOption[];
  selectedValues?: TableFilterValue[];
  multiple?: boolean;
}>(), {
  title: "",
  options: () => [],
  selectedValues: () => [],
  multiple: true
});

const emit = defineEmits<{
  select: [values: TableFilterValue[]];
  close: [];
}>();

function isSelected(value: TableFilterValue) {
  return props.selectedValues.some((item) => Object.is(item, value));
}

function handleOptionClick(value: TableFilterValue) {
  if (props.multiple) {
    const nextValues = isSelected(value)
      ? props.selectedValues.filter((item) => !Object.is(item, value))
      : [...props.selectedValues, value];

    emit("select", nextValues);
    return;
  }

  emit("select", isSelected(value) ? [] : [value]);
  emit("close");
}

function handleReset() {
  emit("select", []);
  emit("close");
}
</script>

<template>
  <div class="xy-table__filter-panel" @click.stop>
    <div v-if="props.title" class="xy-table__filter-panel-title">{{ props.title }}</div>

    <div class="xy-table__filter-panel-list">
      <button
        v-for="option in props.options"
        :key="`${option.text}-${option.value}`"
        class="xy-table__filter-option"
        :class="{ 'is-selected': isSelected(option.value) }"
        type="button"
        @click="handleOptionClick(option.value)"
      >
        <span>{{ option.text }}</span>
        <xy-icon v-if="isSelected(option.value)" icon="mdi:check" :size="14" />
      </button>
    </div>

    <div class="xy-table__filter-panel-footer">
      <button class="xy-table__filter-panel-action" type="button" @click="handleReset">重置</button>
      <button class="xy-table__filter-panel-action is-primary" type="button" @click="emit('close')">
        完成
      </button>
    </div>
  </div>
</template>
