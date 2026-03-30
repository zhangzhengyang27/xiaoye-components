<script setup lang="ts">
import { ref } from "vue";

const visibleColumns = ref(["name", "owner", "status"]);
const columns = [
  { key: "name", label: "任务名称" },
  { key: "owner", label: "负责人" },
  { key: "status", label: "状态" },
  { key: "updatedAt", label: "更新时间" },
  { key: "actions", label: "操作列", disabled: true, description: "固定保留" }
];
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-column-setting-panel v-model="visibleColumns" :columns="columns" />

    <xy-card header="当前启用列">
      {{ visibleColumns.join("、") }}
    </xy-card>
  </div>
</template>
