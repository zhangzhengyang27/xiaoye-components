<template>
  <xy-scrollbar height="220px">
    <div class="demo-scroll-list">
      <section v-for="item in 8" :key="item" class="demo-scroll-card">
        <strong>规则块 {{ item }}</strong>
        <p>用于演示固定高度下的纵向滚动，适合侧栏说明区、筛选说明块和卡片列表。</p>
      </section>
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

.demo-scroll-card {
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 14px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 72%, white);
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
