<script setup lang="ts">
const reviewMetrics = [
  {
    title: "命中规则数",
    value: 27,
    suffix: "条",
    note: "高风险规则 4 条，需要人工补充说明",
    prefix: "Risk"
  },
  {
    title: "历史成交额",
    value: "N/A",
    suffix: "",
    note: "新商家还没有形成完整历史样本，允许字符串占位",
    prefix: "History"
  },
  {
    title: "建议授信额度",
    value: 580000,
    suffix: "元",
    note: "审批通过后将同步更新到风控限额中心",
    prefix: "Limit"
  }
] as const;
</script>

<template>
  <xy-card class="statistic-review-panel" shadow="always" variant="muted">
    <template #header>
      <div class="statistic-review-panel__header">
        <div>
          <strong>风控审批摘要</strong>
          <p>在审批、风控和复核面板里，统计值往往会和占位文案、说明项一起出现，而不总是纯数字。</p>
        </div>
        <xy-tag status="warning" round>待人工确认</xy-tag>
      </div>
    </template>

    <div class="statistic-review-panel__list">
      <div
        v-for="item in reviewMetrics"
        :key="item.title"
        class="statistic-review-panel__item"
      >
        <xy-statistic
          :title="item.title"
          :value="item.value"
          :suffix="item.suffix"
          :precision="item.title === '建议授信额度' ? 2 : 0"
        >
          <template #prefix>
            <span class="statistic-review-panel__prefix">{{ item.prefix }}</span>
          </template>
        </xy-statistic>
        <p>{{ item.note }}</p>
      </div>
    </div>
  </xy-card>
</template>

<style scoped>
.statistic-review-panel {
  max-width: 760px;
}

.statistic-review-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.statistic-review-panel__header p,
.statistic-review-panel__item p {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.statistic-review-panel__list {
  display: grid;
  gap: 14px;
}

.statistic-review-panel__item {
  padding: 14px 16px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--xy-bg-color) 94%, var(--xy-bg-color-muted));
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 84%, white);
}

.statistic-review-panel__prefix {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

@media (max-width: 640px) {
  .statistic-review-panel__header {
    flex-direction: column;
  }
}
</style>
