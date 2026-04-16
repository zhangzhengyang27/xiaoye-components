<script setup lang="ts">
import { ref } from "vue";

const loading = ref(true);
</script>

<template>
  <div class="demo-skeleton-switch">
    <xy-space wrap>
      <xy-button type="primary" @click="loading = !loading">
        {{ loading ? "查看真实内容" : "切回骨架态" }}
      </xy-button>
      <xy-tag :status="loading ? 'warning' : 'success'" round>
        {{ loading ? "loading = true" : "loading = false" }}
      </xy-tag>
    </xy-space>

    <xy-card shadow="never">
      <xy-skeleton :loading="loading" animated>
        <template #template>
          <div class="demo-skeleton-switch__template">
            <xy-skeleton-item variant="circle" />
            <div class="demo-skeleton-switch__content">
              <xy-skeleton-item variant="h3" style="width: 44%;" />
              <xy-skeleton-item variant="text" />
              <xy-skeleton-item variant="text" style="width: 72%;" />
              <xy-skeleton-item variant="button" />
            </div>
          </div>
        </template>

        <div class="demo-skeleton-switch__real">
          <xy-avatar size="lg">QA</xy-avatar>
          <div class="demo-skeleton-switch__content">
            <strong>退款工单中心</strong>
            <p class="demo-skeleton-switch__real-description">今日已自动分派 34 条工单，仍有 6 条需要人工复核。</p>
            <xy-button plain>查看分派规则</xy-button>
          </div>
        </div>
      </xy-skeleton>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-skeleton-switch {
  display: grid;
  gap: 16px;
  max-width: 680px;
}

.demo-skeleton-switch__template,
.demo-skeleton-switch__real {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;
}

.demo-skeleton-switch__content {
  display: grid;
  gap: 12px;
}

.demo-skeleton-switch__real-description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}

@media (max-width: 640px) {
  .demo-skeleton-switch__template,
  .demo-skeleton-switch__real {
    grid-template-columns: 1fr;
  }
}
</style>
