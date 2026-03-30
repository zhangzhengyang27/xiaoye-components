<script setup lang="ts">
const cards = [
  {
    title: "本周成交额",
    value: "128,000",
    description: "较上周继续提升",
    icon: "mdi:cash-multiple",
    trend: "up" as const,
    trendText: "环比 +12%"
  },
  {
    title: "退款申请",
    value: 18,
    description: "需要关注异常退款单",
    icon: "mdi:cash-refund",
    trend: "down" as const,
    trendText: "环比 -4%"
  },
  {
    title: "待处理工单",
    value: 36,
    description: "今日排班稳定",
    icon: "mdi:clipboard-text-clock-outline",
    trend: "flat" as const,
    trendText: "环比持平"
  }
];
</script>

<template>
  <div
    style="
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    "
  >
    <xy-stat-card
      v-for="card in cards"
      :key="card.title"
      :title="card.title"
      :value="card.value"
      :description="card.description"
      :icon="card.icon"
      :trend="card.trend"
      :trend-text="card.trendText"
    />
    <xy-stat-card title="数据装载中" loading />
  </div>
</template>
