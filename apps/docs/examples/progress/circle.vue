<script setup lang="ts">
const kpiCards = [
  {
    title: "履约率",
    subtitle: "订单中心 · 过去 24 小时",
    type: "circle" as const,
    percentage: 92,
    status: "success" as const,
    tag: "稳定"
  },
  {
    title: "SLA 达成率",
    subtitle: "客服工作台 · 本周",
    type: "dashboard" as const,
    percentage: 78,
    color: [
      { color: "#dc2626", percentage: 45 },
      { color: "#f59e0b", percentage: 80 },
      { color: "#059669", percentage: 100 }
    ],
    tag: "需跟进"
  },
  {
    title: "存储配额",
    subtitle: "素材服务 · 当前集群",
    type: "circle" as const,
    percentage: 64,
    color: "linear-gradient(180deg, #0f766e, #2563eb)",
    tag: "扩容前安全"
  }
];
</script>

<template>
  <div class="progress-kpi-grid">
    <xy-card
      v-for="item in kpiCards"
      :key="item.title"
      class="progress-kpi-grid__card"
      bordered
      shadow="hover"
      body-class="demo-progress-circle__body"
    >
      <div class="progress-kpi-grid__head">
        <div>
          <strong>{{ item.title }}</strong>
          <p class="progress-kpi-grid__subtitle">{{ item.subtitle }}</p>
        </div>
        <xy-tag status="neutral" round>{{ item.tag }}</xy-tag>
      </div>
      <xy-progress
        :type="item.type"
        :percentage="item.percentage"
        :status="item.status"
        :color="item.color"
        :width="120"
      >
        <span>{{ item.percentage }}%</span>
      </xy-progress>
      <div class="progress-kpi-grid__footer">
        <xy-text type="info">
          {{ item.type === "dashboard" ? "适合强调距离目标还有多少" : "适合放在概览指标卡里" }}
        </xy-text>
      </div>
    </xy-card>
  </div>
</template>

<style scoped>
.progress-kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

:global(.demo-progress-circle__body) {
  display: grid;
  justify-items: center;
  gap: 16px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.progress-kpi-grid__card {
  height: 100%;
}

.progress-kpi-grid__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
}

.progress-kpi-grid__subtitle {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.progress-kpi-grid__footer {
  text-align: center;
}

@media (max-width: 720px) {
  .progress-kpi-grid {
    grid-template-columns: 1fr;
  }

  .progress-kpi-grid__head {
    flex-direction: column;
  }
}
</style>
