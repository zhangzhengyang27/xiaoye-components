<script setup lang="ts">
const sections = [
  {
    id: "anchor-basic-overview",
    title: "概览",
    description: "Anchor 适合承接长内容页的目录导航和章节定位。"
  },
  {
    id: "anchor-basic-pattern",
    title: "使用方式",
    description: "推荐先从 vertical 单列导航开始，用最小目录把内容结构跑通。"
  },
  {
    id: "anchor-basic-handoff",
    title: "接入建议",
    description: "标题、段落和说明块本身仍由页面层维护，Anchor 只负责定位和高亮。"
  }
];
</script>

<template>
  <div class="demo-anchor-basic">
    <xy-anchor
      class="demo-anchor-basic__nav"
      container=".demo-anchor-basic__viewport"
      :sync-hash="false"
    >
      <xy-anchor-link
        v-for="section in sections"
        :key="section.id"
        :title="section.title"
        :href="`#${section.id}`"
      />
    </xy-anchor>

    <div class="demo-anchor-basic__viewport">
      <section
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
        class="demo-anchor-basic__section"
      >
        <h4>{{ section.title }}</h4>
        <p>{{ section.description }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.demo-anchor-basic {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 20px;
}

.demo-anchor-basic__viewport {
  height: 300px;
  overflow: auto;
  padding: 8px 16px;
  border: 1px solid var(--xy-border-color);
  border-radius: var(--xy-radius-md);
  background: var(--xy-bg-color-muted);
}

.demo-anchor-basic__section {
  min-height: 180px;
  padding: 20px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 78%, white);
}

.demo-anchor-basic__section:last-child {
  border-bottom: 0;
}

.demo-anchor-basic__section h4 {
  margin: 0 0 10px;
  color: var(--xy-text-color);
  font-size: 20px;
}

.demo-anchor-basic__section p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .demo-anchor-basic {
    grid-template-columns: 1fr;
  }
}
</style>
