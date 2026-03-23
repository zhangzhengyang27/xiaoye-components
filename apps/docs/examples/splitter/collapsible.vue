<script setup lang="ts">
import { ref } from "vue";

const leftSize = ref(240);

const sections = ["Filters", "Saved Views", "Shortcuts"];
const records = [
  { id: "SP-2048", title: "Refine splitter grip motion", status: "Reviewing" },
  { id: "SP-2051", title: "Polish lazy preview overlay", status: "Ready" }
];
</script>

<template>
  <div class="demo-splitter-collapsible">
    <header class="demo-splitter-collapsible__header">
      <div class="demo-splitter-collapsible__title">
        <xy-text tag="strong">Inspector Layout</xy-text>
        <xy-text tag="p" size="sm" type="info">
          当前侧栏宽度 {{ Math.round(leftSize) }}px，点击或拖拽都可以调整。
        </xy-text>
      </div>
      <xy-space size="sm">
        <xy-tag size="sm" round>lazy</xy-tag>
        <xy-tag size="sm" status="success" round>resizable</xy-tag>
      </xy-space>
    </header>

    <div class="demo-splitter-collapsible__stage">
      <xy-splitter lazy>
        <xy-splitter-panel v-model:size="leftSize" min="160px" collapsible>
          <aside class="demo-splitter-side">
            <div class="demo-splitter-side__toolbar">
              <span>Inspector</span>
              <button>+</button>
            </div>

            <div class="demo-splitter-side__stack">
              <button
                v-for="section in sections"
                :key="section"
                class="demo-splitter-side__item"
                :class="{ 'is-active': section === 'Filters' }"
              >
                {{ section }}
              </button>
            </div>

            <div class="demo-splitter-side__hint">
              折叠侧栏后，右侧结果区会立即回收空间，更接近 IDE 的检查器布局。
            </div>
          </aside>
        </xy-splitter-panel>

        <xy-splitter-panel min="320px">
          <section class="demo-splitter-main">
            <div class="demo-splitter-main__toolbar">
              <div class="demo-splitter-main__tabs">
                <button class="is-active">Issues</button>
                <button>Commits</button>
                <button>Preview</button>
              </div>
              <xy-button size="sm">Run Check</xy-button>
            </div>

            <div class="demo-splitter-records">
              <article v-for="record in records" :key="record.id" class="demo-splitter-record">
                <div class="demo-splitter-record__body">
                  <span>{{ record.id }}</span>
                  <strong>{{ record.title }}</strong>
                </div>
                <xy-tag
                  size="sm"
                  :status="record.status === 'Ready' ? 'success' : 'primary'"
                  round
                >
                  {{ record.status }}
                </xy-tag>
              </article>
            </div>
          </section>
        </xy-splitter-panel>
      </xy-splitter>
    </div>
  </div>
</template>

<style scoped>
.demo-splitter-collapsible {
  height: 336px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 90%, white);
  border-radius: 24px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color-muted) 70%, white), transparent 24%),
    var(--xy-bg-color);
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.08);
}

.demo-splitter-collapsible__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 84%, white);
  background: color-mix(in srgb, var(--xy-bg-color) 86%, white);
}

.demo-splitter-collapsible__title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-splitter-collapsible__title :deep(p) {
  margin: 0;
}

.demo-splitter-collapsible__stage {
  height: calc(100% - 69px);
}

.demo-splitter-side,
.demo-splitter-main {
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.demo-splitter-side {
  padding: 14px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color-muted) 88%, white), transparent 20%),
    color-mix(in srgb, var(--xy-bg-color-muted) 76%, white);
}

.demo-splitter-side__toolbar,
.demo-splitter-main__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.demo-splitter-side__toolbar {
  padding: 4px 2px 14px;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.demo-splitter-side__toolbar button {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 84%, white);
  border-radius: 8px;
  background: color-mix(in srgb, var(--xy-bg-color) 88%, white);
}

.demo-splitter-side__stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-splitter-side__item {
  padding: 10px 12px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--xy-text-color-secondary);
  text-align: left;
}

.demo-splitter-side__item.is-active {
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
  color: var(--xy-text-color);
}

.demo-splitter-side__hint {
  margin-top: auto;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 86%, white);
  border-radius: 16px;
  background: color-mix(in srgb, var(--xy-bg-color) 74%, white);
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.demo-splitter-main {
  padding: 14px;
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--xy-color-primary) 6%, white), transparent 30%),
    var(--xy-bg-color);
}

.demo-splitter-main__tabs {
  display: flex;
  gap: 8px;
}

.demo-splitter-main__tabs button {
  padding: 8px 12px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--xy-text-color-secondary);
}

.demo-splitter-main__tabs button.is-active {
  border-color: color-mix(in srgb, var(--xy-color-primary) 16%, white);
  background: color-mix(in srgb, var(--xy-color-primary) 8%, white);
  color: var(--xy-text-color);
}

.demo-splitter-records {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  margin-top: 14px;
  overflow: auto;
}

.demo-splitter-record {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 13px 16px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 16px;
  background: color-mix(in srgb, var(--xy-bg-color) 88%, white);
}

.demo-splitter-record__body {
  min-width: 0;
}

.demo-splitter-record span {
  display: block;
  margin-bottom: 5px;
  color: var(--xy-text-color-muted);
  font-family: "SFMono-Regular", "SF Mono", Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
}

.demo-splitter-record strong {
  display: block;
  color: var(--xy-text-color);
  line-height: 1.35;
}

.demo-splitter-record :deep(.xy-tag) {
  flex-shrink: 0;
  margin-top: 2px;
}

@media (max-width: 720px) {
  .demo-splitter-collapsible__header,
  .demo-splitter-main__toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
