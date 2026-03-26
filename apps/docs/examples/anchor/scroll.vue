<script setup lang="ts">
const sections = [
  {
    id: "anchor-scroll-metric",
    title: "指标区",
    description: "顶部保留了一条 sticky 工具栏，所以滚动定位需要额外 offset。"
  },
  {
    id: "anchor-scroll-queue",
    title: "任务队列",
    description: "局部滚动容器里常见的就是一侧目录、一侧长内容。"
  },
  {
    id: "anchor-scroll-detail",
    title: "说明区",
    description: "bound 可以提前切换高亮，避免目录反馈明显滞后。"
  }
];
</script>

<template>
  <div class="demo-anchor-scroll">
    <xy-anchor
      class="demo-anchor-scroll__nav"
      container=".demo-anchor-scroll__viewport"
      :offset="48"
      :bound="8"
      :sync-hash="false"
    >
      <xy-anchor-link
        v-for="section in sections"
        :key="section.id"
        :title="section.title"
        :href="`#${section.id}`"
      />
    </xy-anchor>

    <div class="demo-anchor-scroll__viewport">
      <div class="demo-anchor-scroll__toolbar">sticky header / offset = 48</div>

      <section
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
        class="demo-anchor-scroll__section"
      >
        <h4>{{ section.title }}</h4>
        <p>{{ section.description }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.demo-anchor-scroll {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 20px;
}

.demo-anchor-scroll__viewport {
  height: 300px;
  overflow: auto;
  border: 1px solid var(--xy-border-color);
  border-radius: var(--xy-radius-md);
  background: var(--xy-bg-color);
}

.demo-anchor-scroll__toolbar {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 14px 16px;
  background: color-mix(in srgb, var(--xy-color-primary) 8%, white);
  color: var(--xy-color-primary);
  font-size: 13px;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 82%, white);
}

.demo-anchor-scroll__section {
  min-height: 180px;
  padding: 20px 16px;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 82%, white);
}

.demo-anchor-scroll__section:last-child {
  border-bottom: 0;
}

.demo-anchor-scroll__section h4 {
  margin: 0 0 10px;
  color: var(--xy-text-color);
  font-size: 20px;
}

.demo-anchor-scroll__section p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .demo-anchor-scroll {
    grid-template-columns: 1fr;
  }
}
</style>
