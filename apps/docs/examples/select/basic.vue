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
  <div class="demo-select-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-select-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>单选筛选</xy-tag>
        </div>
        <p class="demo-select-basic__description">
          支持前缀图标、搜索和自定义选项展示。
        </p>
      </template>

      <div class="demo-select-basic__field">
        <xy-select
          v-model="selectedStatus"
          :options="statusOptions"
          placeholder="请选择状态筛选条件"
          prefix-icon="mdi:magnify"
        />
      </div>

      <template #footer>
        <xy-tag :status="selectedStatus === 'active' ? 'success' : selectedStatus === 'inactive' ? 'warning' : 'neutral'" round>
          当前选择：{{ statusOptions.find(o => o.value === selectedStatus)?.label || "未选择" }}
        </xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-select-basic {
  max-width: 400px;
}

.demo-select-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-select-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-select-basic__field {
  width: 100%;
}
</style>
