<script setup lang="ts">
import { ref } from "vue";

const currentHref = ref("#anchor-change-intro");
const lastClick = ref("-");

const sections = [
  { id: "anchor-change-intro", title: "介绍", description: "change 适合给页面层同步当前章节。" },
  { id: "anchor-change-api", title: "API", description: "click 更适合埋点、日志或侧边联动。" },
  {
    id: "anchor-change-checklist",
    title: "检查项",
    description: "你可以把 active href 回写到外部状态或 URL。"
  }
];

function handleChange(href: string) {
  currentHref.value = href;
}

function handleClick(_event: MouseEvent, href?: string) {
  lastClick.value = href ?? "-";
}
</script>

<template>
  <div class="demo-anchor-change">
    <div class="demo-anchor-change__panel">
      <strong class="demo-anchor-change__panel-label">当前高亮</strong>
      <span class="demo-anchor-change__panel-value">{{ currentHref }}</span>
      <strong class="demo-anchor-change__panel-label">最近点击</strong>
      <span class="demo-anchor-change__panel-value">{{ lastClick }}</span>
    </div>

    <div class="demo-anchor-change__layout">
      <xy-anchor
        container=".demo-anchor-change__viewport"
        :sync-hash="false"
        @change="handleChange"
        @click="handleClick"
      >
        <xy-anchor-link
          v-for="section in sections"
          :key="section.id"
          :title="section.title"
          :href="`#${section.id}`"
        />
      </xy-anchor>

      <div class="demo-anchor-change__viewport">
        <section
          v-for="(section, index) in sections"
          :id="section.id"
          :key="section.id"
          class="demo-anchor-change__section"
          :class="{ 'is-last': index === sections.length - 1 }"
        >
          <h4 class="demo-anchor-change__section-title">{{ section.title }}</h4>
          <p class="demo-anchor-change__section-description">{{ section.description }}</p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-anchor-change {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-anchor-change__panel {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr;
  gap: 8px 12px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid var(--xy-border-color);
  border-radius: var(--xy-radius-md);
  background: var(--xy-bg-color-muted);
}

.demo-anchor-change__panel-label {
  color: var(--xy-text-color);
  font-size: 13px;
}

.demo-anchor-change__panel-value {
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.demo-anchor-change__layout {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 20px;
}

.demo-anchor-change__viewport {
  height: 280px;
  overflow: auto;
  padding: 8px 16px;
  border: 1px solid var(--xy-border-color);
  border-radius: var(--xy-radius-md);
}

.demo-anchor-change__section {
  min-height: 180px;
  padding: 20px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 82%, white);
}

.demo-anchor-change__section.is-last {
  border-bottom: 0;
}

.demo-anchor-change__section-title {
  margin: 0 0 10px;
  color: var(--xy-text-color);
}

.demo-anchor-change__section-description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .demo-anchor-change__panel,
  .demo-anchor-change__layout {
    grid-template-columns: 1fr;
  }
}
</style>
