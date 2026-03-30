<script setup lang="ts">
import { computed, ref } from "vue";

const range = ref<string | number | boolean>("week");
const options = [
  { label: "按天", value: "day", description: "24h" },
  { label: "按周", value: "week", description: "7d" },
  { label: "按月", value: "month", description: "30d" },
  { label: "按年", value: "year", disabled: true }
];

const summaryMap = {
  day: { title: "今日访问", value: "18,240", hint: "按小时聚合" },
  week: { title: "本周访问", value: "126,480", hint: "按 7 天滚动窗口聚合" },
  month: { title: "本月访问", value: "521,300", hint: "按自然月聚合" },
  year: { title: "本年访问", value: "6,940,000", hint: "按 12 个月聚合" }
} as const satisfies Record<string, { title: string; value: string; hint: string }>;

const activeSummary = computed(() => {
  const key = typeof range.value === "string" && range.value in summaryMap ? range.value : "week";
  return summaryMap[key as keyof typeof summaryMap];
});
</script>

<template>
  <div class="demo-radio-button">
    <section class="demo-radio-button__hero">
      <header class="demo-radio-button__header">
        <div class="demo-radio-button__title">
          <xy-text tag="strong">Analytics Range</xy-text>
          <xy-text size="sm" type="info">
            用按钮化单选切换统计维度，比普通单选更接近工具栏里的模式切换器。
          </xy-text>
        </div>
        <xy-tag size="sm" status="success" round>Synced</xy-tag>
      </header>

      <xy-radio-group
        v-model="range"
        type="button"
        fill="#1d4ed8"
        text-color="#f8fafc"
        :options="options"
      />

      <div class="demo-radio-button__cards">
        <xy-card class="demo-radio-button__card demo-radio-button__card--primary" shadow="hover">
          <span>{{ activeSummary.title }}</span>
          <strong>{{ activeSummary.value }}</strong>
          <p>{{ activeSummary.hint }}</p>
        </xy-card>
        <xy-card class="demo-radio-button__card" shadow="hover">
          <span>转化率</span>
          <strong>18.2%</strong>
          <p>切换范围后保持同一套指标口径。</p>
        </xy-card>
        <xy-card class="demo-radio-button__card" shadow="hover">
          <span>活跃渠道</span>
          <strong>Webhook</strong>
          <p>适合和 Tabs、Segmented 一样承担视图切换职责。</p>
        </xy-card>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-radio-button {
  width: 100%;
}

.demo-radio-button__hero {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 22px;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--xy-color-primary) 8%, white), transparent 34%),
    var(--xy-bg-color);
}

.demo-radio-button__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.demo-radio-button__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-radio-button__cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.demo-radio-button__card--primary {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--xy-color-primary) 7%, white), transparent 48%),
    color-mix(in srgb, var(--xy-bg-color) 88%, white);
}

.demo-radio-button__card span {
  display: block;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.demo-radio-button__card strong {
  display: block;
  margin-top: 8px;
  color: var(--xy-text-color);
  font-size: 24px;
  line-height: 1.1;
}

.demo-radio-button__card p {
  margin: 10px 0 0;
  color: var(--xy-text-color-muted);
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 760px) {
  .demo-radio-button__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .demo-radio-button__cards {
    grid-template-columns: 1fr;
  }
}
</style>
