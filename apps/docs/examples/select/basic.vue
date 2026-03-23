<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | number | null>("active");
const options = [
  { label: "全部状态", value: "all" },
  { label: "已启用", value: "active" },
  { label: "已停用", value: "inactive" }
];
</script>

<template>
  <div class="xy-doc-stack">
    <xy-select
      v-model="value"
      :options="options"
      placeholder="请选择状态"
      prefix-icon="mdi:magnify"
    />
    <xy-tag status="primary">当前值：{{ value ?? "未选择" }}</xy-tag>
  </div>
</template>
