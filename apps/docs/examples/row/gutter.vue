<template>
  <xy-row :gutter="24">
    <xy-col :span="6">
      <div class="demo-card">
        <strong>6</strong>
        <span>左侧导航</span>
      </div>
    </xy-col>
    <xy-col :span="6">
      <div class="demo-card">
        <strong>6</strong>
        <span>筛选区</span>
      </div>
    </xy-col>
    <xy-col :span="6">
      <div class="demo-card">
        <strong>6</strong>
        <span>图表卡片</span>
      </div>
    </xy-col>
    <xy-col :span="6">
      <div class="demo-card">
        <strong>6</strong>
        <span>统计摘要</span>
      </div>
    </xy-col>
  </xy-row>
</template>

<style scoped>
.demo-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 76px;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 14px;
  background: var(--xy-bg-color);
  box-shadow: var(--xy-shadow-sm);
}

.demo-card strong {
  font-size: 18px;
  color: var(--xy-text-color);
}

.demo-card span {
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}
</style>
