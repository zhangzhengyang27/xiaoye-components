<script setup lang="ts">
import { ref } from "vue";

const loading = ref(true);

function toggleLoading() {
  loading.value = !loading.value;
}
</script>

<template>
  <!-- 加载状态基础用法：展示容器级别的加载遮罩 -->
  <div class="demo-loading-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-loading-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>容器遮罩</xy-tag>
        </div>
        <p class="demo-loading-basic__description">
          加载状态用于容器级别的加载提示，适合表格、卡片和分区面板。
        </p>
      </template>

      <xy-space wrap>
        <xy-button type="primary" @click="toggleLoading">
          {{ loading ? "关闭加载" : "开启加载" }}
        </xy-button>
        <xy-tag :status="loading ? 'warning' : 'success'" round>
          {{ loading ? "容器加载中" : "容器空闲" }}
        </xy-tag>
      </xy-space>

      <xy-card v-loading="loading" xy-loading-text="正在拉取报表数据..." class="loading-demo-card">
        <div class="demo-loading-basic__content">
          <strong>运营日报</strong>
          <p>这个示例展示最常见的容器内遮罩用法，适合表格、卡片和分区面板。</p>
        </div>
      </xy-card>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-loading-basic {
  max-width: 640px;
}

.demo-loading-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-loading-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-loading-basic__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-loading-basic__content p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}

.loading-demo-card {
  margin-top: 16px;
}
</style>
