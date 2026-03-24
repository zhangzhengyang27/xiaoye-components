<template>
  <div class="demo-skeleton-repeat">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-skeleton-repeat__head">
          <strong>卡片区加载</strong>
          <xy-tag status="primary" round>animated</xy-tag>
        </div>
      </template>
      <xy-skeleton animated :rows="3" />
    </xy-card>

    <xy-card shadow="never">
      <template #header>
        <div class="demo-skeleton-repeat__head">
          <strong>双列摘要卡占位</strong>
          <xy-tag status="warning" round>count = 2</xy-tag>
        </div>
      </template>
      <xy-skeleton animated :count="2" :rows="2">
        <template #template>
          <div class="demo-skeleton-repeat__item">
            <xy-skeleton-item variant="h3" style="width: 48%;" />
            <xy-skeleton-item variant="text" />
            <xy-skeleton-item variant="text" style="width: 78%;" />
          </div>
        </template>
      </xy-skeleton>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-skeleton-repeat {
  display: grid;
  gap: 16px;
  max-width: 640px;
}

.demo-skeleton-repeat__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.demo-skeleton-repeat__item {
  display: grid;
  gap: 12px;
  margin-bottom: 14px;
}

.demo-skeleton-repeat__item:last-child {
  margin-bottom: 0;
}
</style>
