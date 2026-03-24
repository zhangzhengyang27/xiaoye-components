<script setup lang="ts">
const uploadItems = [
  {
    file: "用户主数据回填",
    size: "主账号、组织关系与角色快照",
    percentage: 46,
    striped: true,
    tag: "回填中"
  },
  {
    file: "订单缺失明细补录",
    size: "从队列消费增量日志并回放",
    percentage: 64,
    stripedFlow: true,
    tag: "推进中"
  },
  {
    file: "仓储对账任务",
    size: "等待上游返回准确的差异条数",
    percentage: 0,
    indeterminate: true,
    stripedFlow: true,
    tag: "排队中"
  }
];
</script>

<template>
  <xy-card class="progress-sync-board" shadow="always">
    <template #header>
      <div class="progress-sync-board__header">
        <div>
          <strong>同步与回填状态</strong>
          <p>拿不到准确百分比时，用 `indeterminate` 承接“已开始，但仍在推进”的状态。</p>
        </div>
        <xy-tag status="warning" round>夜间任务窗口</xy-tag>
      </div>
    </template>

    <div class="progress-sync-board__list">
      <div
        v-for="item in uploadItems"
        :key="item.file"
        class="progress-sync-board__row"
      >
        <div class="progress-sync-board__meta">
          <div>
            <strong>{{ item.file }}</strong>
            <p>{{ item.size }}</p>
          </div>
          <xy-tag :status="item.indeterminate ? 'warning' : 'primary'" round>
            {{ item.tag }}
          </xy-tag>
        </div>
        <xy-progress
          :percentage="item.percentage"
          :striped="item.striped"
          :striped-flow="item.stripedFlow"
          :indeterminate="item.indeterminate"
          :color="item.indeterminate ? 'linear-gradient(90deg, #64748b, #2563eb)' : undefined"
        >
          <template #default="{ percentage }">
            <span>{{ item.indeterminate ? "已接收任务，但暂无准确百分比" : `${percentage}%` }}</span>
          </template>
        </xy-progress>
      </div>
    </div>
  </xy-card>
</template>

<style scoped>
.progress-sync-board {
  max-width: 700px;
}

.progress-sync-board__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.progress-sync-board__header p,
.progress-sync-board__meta p {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}

.progress-sync-board__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.progress-sync-board__row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border: 1px dashed color-mix(in srgb, var(--xy-border-color) 74%, white);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.94), rgba(255, 255, 255, 0.94));
}

.progress-sync-board__meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

@media (max-width: 640px) {
  .progress-sync-board__header,
  .progress-sync-board__meta {
    flex-direction: column;
  }
}
</style>
