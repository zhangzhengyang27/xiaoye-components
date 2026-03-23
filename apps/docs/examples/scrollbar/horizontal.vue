<template>
  <xy-scrollbar>
    <div class="demo-scroll-board">
      <article v-for="item in 6" :key="item" class="demo-scroll-board__item">
        <strong>列 {{ item }}</strong>
        <p>横向滚动适合时间轴、统计卡片带和可拖动泳道。</p>
      </article>
    </div>
  </xy-scrollbar>
</template>

<style scoped>
.demo-scroll-board {
  display: inline-flex;
  gap: 12px;
  min-width: max-content;
  padding-bottom: 12px;
}

.demo-scroll-board__item {
  width: 220px;
  min-height: 116px;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 86%, white);
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--xy-color-success) 10%, white),
    color-mix(in srgb, var(--xy-bg-color-muted) 84%, white)
  );
}

.demo-scroll-board__item strong {
  display: block;
  margin-bottom: 8px;
  color: var(--xy-text-color);
}

.demo-scroll-board__item p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
