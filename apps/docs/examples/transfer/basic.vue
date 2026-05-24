<script setup lang="ts">
import { ref } from "vue";

const value = ref([2]);
const data = [
  { key: 1, label: "控制台" },
  { key: 2, label: "账单中心" },
  { key: 3, label: "配置中心" }
];
</script>

<template>
  <!-- 穿梭框基础用法：展示双向数据选择 -->
  <div class="demo-transfer-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-transfer-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>双向选择</xy-tag>
        </div>
        <p class="demo-transfer-basic__description">
          穿梭框用于在两个列表之间移动数据，适合权限分配等场景。
        </p>
      </template>

      <xy-transfer v-model="value" :data="data" />
    </xy-card>
  </div>
</template>

<style scoped>
.demo-transfer-basic {
  max-width: 640px;
}

.demo-transfer-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-transfer-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
