<template>
  <xy-card class="breadcrumb-scene-card" shadow="always">
    <xy-breadcrumb separator-icon="mdi:chevron-right">
      <xy-breadcrumb-item href="/">结算中心</xy-breadcrumb-item>
      <xy-breadcrumb-item href="/components/statistic">对账任务</xy-breadcrumb-item>
      <xy-breadcrumb-item href="/components/table">异常工单</xy-breadcrumb-item>
      <xy-breadcrumb-item>工单详情</xy-breadcrumb-item>
    </xy-breadcrumb>

    <div class="breadcrumb-scene-card__body">
      <span class="breadcrumb-scene-card__kicker">Settlement Ticket</span>
      <strong>工单 #TK-20260326-014</strong>
      <p class="breadcrumb-scene-card__description">
        面包屑更适合放在详情页、抽屉页或多级后台目录的顶部，帮助用户快速判断自己当前所处的业务层级。
      </p>
    </div>
  </xy-card>
</template>

<style scoped>
.breadcrumb-scene-card {
  display: grid;
  gap: 18px;
  max-width: 760px;
}

.breadcrumb-scene-card__body {
  display: grid;
  gap: 8px;
}

.breadcrumb-scene-card__kicker {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.breadcrumb-scene-card__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
