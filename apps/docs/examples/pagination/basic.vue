<script setup lang="ts">
import { ref } from "vue";

const currentPage = ref(3);
const pageSize = ref(20);
</script>

<template>
  <!-- 分页基础用法：展示数据分页导航 -->
  <div class="demo-pagination-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-pagination-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>数据分页</xy-tag>
        </div>
        <p class="demo-pagination-basic__description">
          分页组件用于处理大量数据的分页展示，支持当前页和每页条数切换。
        </p>
      </template>

      <xy-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="86"
      />

      <template #footer>
        <xy-tag status="primary" round>
          第 {{ currentPage }} 页 / 每页 {{ pageSize }} 条
        </xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-pagination-basic {
  max-width: 640px;
}

.demo-pagination-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-pagination-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
