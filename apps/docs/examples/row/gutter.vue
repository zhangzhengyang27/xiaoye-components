<template>
  <xy-row :gutter="24">
    <xy-col :span="6">
      <xy-card shadow="hover">
        <div class="demo-card-content">
          <strong>6</strong>
          <span>左侧导航</span>
        </div>
      </xy-card>
    </xy-col>
    <xy-col :span="6">
      <xy-card shadow="hover">
        <div class="demo-card-content">
          <strong>6</strong>
          <span>筛选区</span>
        </div>
      </xy-card>
    </xy-col>
    <xy-col :span="6">
      <xy-card shadow="hover">
        <div class="demo-card-content">
          <strong>6</strong>
          <span>图表卡片</span>
        </div>
      </xy-card>
    </xy-col>
    <xy-col :span="6">
      <xy-card shadow="hover">
        <div class="demo-card-content">
          <strong>6</strong>
          <span>统计摘要</span>
        </div>
      </xy-card>
    </xy-col>
  </xy-row>
</template>

<style scoped>
.demo-card-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 40px;
}

.demo-card-content strong {
  font-size: 18px;
  color: var(--xy-text-color);
}

.demo-card-content span {
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}
</style>
