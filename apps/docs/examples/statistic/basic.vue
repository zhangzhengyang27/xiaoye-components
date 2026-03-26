<script setup lang="ts">
interface Metric {
  title: string;
  value: number;
  prefix?: string;
  suffix: string;
  note: string;
}

const metrics: Metric[] = [
  {
    title: "今日交易额",
    value: 2789456.38,
    prefix: "¥",
    suffix: "元",
    note: "较昨日 +12.4%"
  },
  {
    title: "新增用户",
    value: 4382,
    suffix: "人",
    note: "渠道投放进入收口期"
  },
  {
    title: "服务可用率",
    value: 99.982,
    suffix: "%",
    note: "核心链路保持在 SLA 以内"
  },
  {
    title: "待处理告警",
    value: 17,
    suffix: "条",
    note: "集中在支付与风控域"
  }
];
</script>

<template>
  <div class="statistic-board">
    <xy-card
      v-for="item in metrics"
      :key="item.title"
      shadow="hover"
      class="statistic-board__card"
    >
      <xy-statistic
        :title="item.title"
        :value="item.value"
        :precision="item.title === '服务可用率' ? 3 : 2"
        :prefix="item.prefix"
        :suffix="item.suffix"
      />
      <p>{{ item.note }}</p>
    </xy-card>
  </div>
</template>

<style scoped>
.statistic-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.statistic-board__card {
  padding: 4px;
}

.statistic-board__card p {
  margin: 12px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}
</style>
