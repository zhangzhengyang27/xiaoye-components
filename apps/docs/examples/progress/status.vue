<script setup lang="ts">
const serviceLevels = [
  {
    name: "合同归档导出",
    status: "success" as const,
    percentage: 100,
    stage: "已完成",
    tagStatus: "success" as const,
    summary: "导出批次 #2026-03-25 · 520 份合同全部完成"
  },
  {
    name: "设计稿回收任务",
    status: "warning" as const,
    percentage: 61,
    stage: "待确认",
    tagStatus: "warning" as const,
    summary: "素材目录 A17 · 仍有 9 份文件待补齐"
  },
  {
    name: "发票补录批次",
    status: "exception" as const,
    percentage: 27,
    stage: "失败",
    tagStatus: "danger" as const,
    summary: "夜间任务 #M-9042 · 供应商 2 个字段校验失败"
  }
];

function formatExceptionText(percentage: number) {
  return `待补救 ${percentage}%`;
}
</script>

<template>
  <xy-card class="progress-batch-board" shadow="always" variant="muted">
    <template #header>
      <div class="progress-batch-board__header">
        <div>
          <strong>批处理任务队列</strong>
          <p class="progress-batch-board__header-description">
            导出、回收和补录任务更适合放在列表行里看，而不是单独摆成一排状态条。
          </p>
        </div>
        <xy-tag status="neutral" round>共 3 个任务</xy-tag>
      </div>
    </template>

    <div class="progress-batch-board__list">
      <div
        v-for="item in serviceLevels"
        :key="item.name"
        class="progress-batch-board__row"
      >
        <div class="progress-batch-board__meta">
          <div>
            <strong>{{ item.name }}</strong>
            <p class="progress-batch-board__meta-description">{{ item.summary }}</p>
          </div>
          <xy-tag :status="item.tagStatus" round>{{ item.stage }}</xy-tag>
        </div>
        <xy-progress
          :percentage="item.percentage"
          :status="item.status"
          text-inside
          :stroke-width="18"
          :format="item.status === 'exception' ? formatExceptionText : undefined"
        />
      </div>
    </div>
  </xy-card>
</template>

<style scoped>
.progress-batch-board {
  max-width: 700px;
}

.progress-batch-board__header,
.progress-batch-board__meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.progress-batch-board__header-description,
.progress-batch-board__meta-description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}

.progress-batch-board__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.progress-batch-board__row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--xy-bg-color) 82%, var(--xy-bg-color-muted));
}

@media (max-width: 640px) {
  .progress-batch-board__header,
  .progress-batch-board__meta {
    flex-direction: column;
  }
}
</style>
