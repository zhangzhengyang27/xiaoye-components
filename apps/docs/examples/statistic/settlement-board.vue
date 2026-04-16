<script setup lang="ts">
interface SettlementMetric {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  precision?: number;
  note: string;
  status: "primary" | "success" | "warning" | "danger";
}

const metrics: SettlementMetric[] = [
  {
    title: "待结算金额",
    value: 9823456.42,
    prefix: "¥",
    suffix: "元",
    precision: 2,
    note: "含 12 笔跨境订单，需在今晚 20:00 前复核",
    status: "warning"
  },
  {
    title: "今日已出款",
    value: 6253400,
    prefix: "¥",
    suffix: "元",
    precision: 2,
    note: "自动出款成功率 99.8%，仅 2 笔转人工处理",
    status: "success"
  },
  {
    title: "待处理退款",
    value: 183,
    suffix: "单",
    note: "高于近 7 日均值，建议同步排查支付通道抖动",
    status: "danger"
  },
  {
    title: "账期内回款率",
    value: 94.37,
    suffix: "%",
    precision: 2,
    note: "企业采购客户回款速度低于预期 3.2 个点",
    status: "primary"
  }
];
</script>

<template>
  <xy-card class="statistic-settlement-board" shadow="always">
    <template #header>
      <div class="statistic-settlement-board__header">
        <div>
          <strong>结算运营看板</strong>
          <p class="statistic-settlement-board__header-description">
            财务、结算和商务复核后台里，统计值更常和状态标签、说明文案一起出现，而不是孤立展示。
          </p>
        </div>
        <xy-tag status="primary" round>14:20 更新</xy-tag>
      </div>
    </template>

    <div class="statistic-settlement-board__grid">
      <div v-for="item in metrics" :key="item.title" class="statistic-settlement-board__item">
        <div class="statistic-settlement-board__item-head">
          <xy-tag :status="item.status" round>{{ item.title }}</xy-tag>
        </div>
        <xy-statistic
          :title="item.title"
          :value="item.value"
          :prefix="item.prefix"
          :suffix="item.suffix"
          :precision="item.precision"
        />
        <p class="statistic-settlement-board__item-note">{{ item.note }}</p>
      </div>
    </div>
  </xy-card>
</template>

<style scoped>
.statistic-settlement-board {
  max-width: 860px;
}

.statistic-settlement-board__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.statistic-settlement-board__header-description,
.statistic-settlement-board__item-note {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.statistic-settlement-board__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.statistic-settlement-board__item {
  padding: 16px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 16px;
  background: color-mix(in srgb, var(--xy-surface-raised) 94%, white);
  box-shadow: var(--xy-shadow-xs);
}

.statistic-settlement-board__item-head {
  margin-bottom: 10px;
}

@media (max-width: 640px) {
  .statistic-settlement-board__header {
    flex-direction: column;
  }
}
</style>
