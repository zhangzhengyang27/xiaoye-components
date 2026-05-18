<script setup lang="ts">
import { ref } from "vue";

// 当前选中的状态值，默认为"已启用"
const selectedStatus = ref<string | number | null>("active");

// 状态选项列表：用于筛选或状态切换
const statusOptions = [
  { label: "全部状态", value: "all" },
  { label: "已启用", value: "active" },
  { label: "已停用", value: "inactive" }
];
</script>

<template>
  <!-- 选择器基础用法：展示单选下拉、带搜索图标的状态筛选场景 -->
  <div class="xy-doc-field">
    <xy-select
      v-model="selectedStatus"
      :options="statusOptions"
      placeholder="请选择状态筛选条件"
      prefix-icon="mdi:magnify"
    />
  </div>
</template>
