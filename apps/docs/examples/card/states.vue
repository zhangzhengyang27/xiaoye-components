<script setup lang="ts">
import { ref } from "vue";

const loading = ref(false);
const empty = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="loading = !loading">{{ loading ? "关闭加载态" : "开启加载态" }}</xy-button>
      <xy-button plain @click="empty = !empty">{{ empty ? "恢复内容" : "切换空态" }}</xy-button>
    </xy-space>

    <div class="demo-card-state-grid">
      <xy-card
        header="运行概览"
        footer="最后同步时间：刚刚"
        :loading="loading"
        :empty="!loading && empty"
        empty-title="暂无运行数据"
        empty-description="当前时间范围内没有可展示的指标。"
        style="max-width: 480px"
      >
        <template #loading>
          <div class="demo-card-state-block">
            <xy-icon icon="mdi:loading" :size="18" spin />
            正在同步最新指标...
          </div>
        </template>

        <template #empty>
          <xy-empty title="暂无运行数据" description="可以尝试切换筛选条件或稍后重试。">
            <xy-button plain @click="empty = false">恢复内容</xy-button>
          </xy-empty>
        </template>

        <div class="demo-card-state-copy">
          <strong>成功率 99.8%</strong>
          <p class="demo-card-state-copy__description">过去 24 小时内请求稳定，平均响应时间 182ms。</p>
        </div>
      </xy-card>
    </div>
  </div>
</template>

<style scoped>
.demo-card-state-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.demo-card-state-block {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--xy-text-color-secondary);
}

.demo-card-state-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-card-state-copy__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
}
</style>
