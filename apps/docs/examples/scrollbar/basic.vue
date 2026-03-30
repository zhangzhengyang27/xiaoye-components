<template>
  <xy-scrollbar height="220px">
    <div class="demo-scroll-list">
      <xy-card v-for="item in 8" :key="item" class="demo-scroll-card" shadow="hover">
        <strong>规则块 {{ item }}</strong>
        <p>用于演示固定高度下的纵向滚动,适合侧栏说明区、筛选说明块和卡片列表。</p>
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

.demo-scroll-card strong {
  display: block;
  margin-bottom: 8px;
  color: var(--xy-text-color);
}

.demo-scroll-card p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
