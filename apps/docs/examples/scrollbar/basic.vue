<template>
  <xy-scrollbar height="220px">
    <div class="demo-scroll-list">
      <xy-card v-for="item in 8" :key="item" class="demo-scroll-card" shadow="hover">
        <strong class="demo-scroll-card__title">规则块 {{ item }}</strong>
        <p class="demo-scroll-card__description">用于演示固定高度下的纵向滚动,适合侧栏说明区、筛选说明块和卡片列表。</p>
      </xy-card>
    </div>
  </xy-scrollbar>
</template>

<style scoped>
.demo-scroll-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 8px;
}

.demo-scroll-card__title {
  display: block;
  margin-bottom: 8px;
  color: var(--xy-text-color);
}

.demo-scroll-card__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
