<script setup lang="ts">
const sections = [
  {
    id: "anchor-affix-intro",
    title: "页面概览",
    description: "把 Anchor 固定在滚动容器侧边时，目录会一直可见。"
  },
  {
    id: "anchor-affix-risk",
    title: "风险清单",
    description: "适合变更中心、发布中心、长详情页这种章节很多的后台页面。"
  },
  {
    id: "anchor-affix-check",
    title: "上线检查",
    description: "和 Affix 组合后，目录不会随着内容滚远。"
  }
];
</script>

<template>
  <div class="demo-anchor-affix__shell">
    <div class="demo-anchor-affix__layout">
      <xy-affix class="demo-anchor-affix__aside" target=".demo-anchor-affix__shell" :offset="12">
        <xy-anchor container=".demo-anchor-affix__shell" :sync-hash="false">
          <xy-anchor-link
            v-for="section in sections"
            :key="section.id"
            :title="section.title"
            :href="`#${section.id}`"
          />
        </xy-anchor>
      </xy-affix>

      <div class="demo-anchor-affix__content">
        <section
          v-for="(section, index) in sections"
          :id="section.id"
          :key="section.id"
          class="demo-anchor-affix__section"
          :class="{ 'is-last': index === sections.length - 1 }"
        >
          <h4 class="demo-anchor-affix__section-title">{{ section.title }}</h4>
          <p class="demo-anchor-affix__section-description">{{ section.description }}</p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-anchor-affix__shell {
  height: 320px;
  overflow: auto;
  padding: 12px;
  border: 1px solid var(--xy-border-color);
  border-radius: var(--xy-radius-md);
  background: var(--xy-bg-color);
}

.demo-anchor-affix__layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 20px;
  min-height: 720px;
}

.demo-anchor-affix__content {
  min-width: 0;
}

.demo-anchor-affix__section {
  min-height: 220px;
  padding: 20px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 82%, white);
}

.demo-anchor-affix__section.is-last {
  border-bottom: 0;
}

.demo-anchor-affix__section-title {
  margin: 0 0 10px;
  color: var(--xy-text-color);
}

.demo-anchor-affix__section-description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .demo-anchor-affix__layout {
    grid-template-columns: 1fr;
  }
}
</style>
