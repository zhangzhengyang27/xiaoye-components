<script setup lang="ts">
import { computed } from "vue";
import { XyButton, XyCard, XyCheckboxGroup } from "@xiaoye/components";
import type { ColumnSettingPanelProps } from "./column-setting-panel";

defineOptions({
  name: "XyColumnSettingPanel"
});

const props = withDefaults(defineProps<ColumnSettingPanelProps>(), {
  title: "列设置",
  description: "",
  columns: () => [],
  modelValue: () => []
});

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
  change: [value: string[]];
  reset: [value: string[]];
}>();

const enabledColumnKeys = computed(() =>
  props.columns.filter((column) => !column.disabled).map((column) => column.key)
);

function updateValue(value: Array<string | number | boolean>) {
  const nextValue = value.map((item) => String(item));

  emit("update:modelValue", nextValue);
  emit("change", nextValue);
}

function selectAll() {
  updateValue(enabledColumnKeys.value);
}

function reset() {
  const nextValue = enabledColumnKeys.value;
  emit("update:modelValue", nextValue);
  emit("reset", nextValue);
}
</script>

<template>
  <xy-card class="xy-column-setting-panel">
    <template #header>
      <div class="xy-column-setting-panel__header">
        <div>
          <div class="xy-column-setting-panel__title">{{ props.title }}</div>
          <p v-if="props.description" class="xy-column-setting-panel__description">
            {{ props.description }}
          </p>
        </div>
        <div class="xy-column-setting-panel__actions">
          <xy-button text @click="selectAll">全选</xy-button>
          <xy-button text @click="reset">重置</xy-button>
        </div>
      </div>
    </template>

    <xy-checkbox-group
      :model-value="props.modelValue"
      direction="vertical"
      :options="
        props.columns.map((column) => ({
          label: column.label,
          value: column.key,
          disabled: column.disabled,
          description: column.description
        }))
      "
      @update:model-value="updateValue"
    />
  </xy-card>
</template>
