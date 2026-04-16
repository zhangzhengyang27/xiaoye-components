<script setup lang="ts">
const sections = [
  {
    id: "anchor-horizontal-summary",
    title: "概览",
    description: "horizontal 更适合顶部页内导航、章节切换和长说明页目录。"
  },
  {
    id: "anchor-horizontal-metrics",
    title: "指标",
    description: "首版允许嵌套声明，但视觉会保持扁平，不渲染二级缩进。"
  },
  {
    id: "anchor-horizontal-checklist",
    title: "检查项",
    description: "适合搭在详情页、运维页或后台说明页的顶部工具区。"
  }
];
</script>

<template>
  <div class="demo-anchor-horizontal">
    <xy-anchor
      direction="horizontal"
      container=".demo-anchor-horizontal__viewport"
      :sync-hash="false"
    >
      <xy-anchor-link
        v-for="section in sections"
        :key="section.id"
        :title="section.title"
        :href="`#${section.id}`"
      />
    </xy-anchor>

    <div class="demo-anchor-horizontal__viewport">
      <section
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
        class="demo-anchor-horizontal__section"
      >
        <h4 class="demo-anchor-horizontal__section-title">{{ section.title }}</h4>
        <p class="demo-anchor-horizontal__section-description">{{ section.description }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.demo-anchor-horizontal {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-anchor-horizontal__viewport {
  height: 280px;
  overflow: auto;
  padding: 8px 4px 8px 0;
}

.demo-anchor-horizontal__section {
  min-height: 180px;
  padding: 18px 8px;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 82%, white);
}

.demo-anchor-horizontal__section-title {
  margin: 0 0 10px;
  color: var(--xy-text-color);
  font-size: 20px;
}

.demo-anchor-horizontal__section-description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
