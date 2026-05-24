<script setup lang="ts">
import { ref } from "vue";

const keyword = ref("");
const options = [
  { label: "控制台", value: 1 },
  { label: "账单中心", value: 2 },
  { label: "项目配置", value: 3 }
];
</script>

<template>
  <!-- 自动补全基础用法：展示搜索建议功能 -->
  <div class="demo-auto-complete-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-auto-complete-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>搜索建议</xy-tag>
        </div>
        <p class="demo-auto-complete-basic__description">
          自动补全组件用于搜索输入时提供建议选项。
        </p>
      </template>

      <xy-auto-complete v-model="keyword" :options="options" placeholder="搜索模块" clearable />
    </xy-card>
  </div>
</template>

<style scoped>
.demo-auto-complete-basic {
  max-width: 400px;
}

.demo-auto-complete-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-auto-complete-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
