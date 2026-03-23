<script setup lang="ts">
const tasks = [
  "lint: splitter styles",
  "test: splitter drag preview",
  "docs: update playground"
];

const logs = [
  "[20:48:11] info  split layout mounted",
  "[20:48:14] warn  preview line opacity adjusted",
  "[20:48:19] done  splitter examples refreshed"
];
</script>

<template>
  <div class="demo-splitter-vertical">
    <div class="demo-splitter-vertical__chrome">
      <span>Terminal</span>
      <xy-space size="sm">
        <xy-tag size="sm" round>watch</xy-tag>
        <xy-tag size="sm" status="success" round>idle</xy-tag>
      </xy-space>
    </div>

    <xy-splitter layout="vertical">
      <xy-splitter-panel size="42%" min="120px">
        <section class="demo-splitter-terminal demo-splitter-terminal--top">
          <div class="demo-splitter-terminal__title">
            <xy-text tag="strong">Task Queue</xy-text>
            <xy-text tag="p" size="sm" type="info">
              上半区像命令面板或任务列表，不像普通介绍卡片。
            </xy-text>
          </div>
          <div class="demo-splitter-task-list">
            <button
              v-for="(task, index) in tasks"
              :key="task"
              class="demo-splitter-task"
              :class="{ 'is-active': index === 1 }"
            >
              <span>{{ index + 1 }}</span>
              <strong>{{ task }}</strong>
            </button>
          </div>
        </section>
      </xy-splitter-panel>

      <xy-splitter-panel min="160px">
        <section class="demo-splitter-terminal demo-splitter-terminal--bottom">
          <div class="demo-splitter-terminal__title demo-splitter-terminal__title--stack">
            <xy-text tag="strong">Output Stream</xy-text>
            <xy-text tag="p" size="sm" type="info">
              纵向分隔更适合日志流、终端结果和预览窗口。
            </xy-text>
          </div>
          <div class="demo-splitter-log">
            <div v-for="(log, index) in logs" :key="log" class="demo-splitter-log__line">
              <span>{{ String(index + 41).padStart(3, "0") }}</span>
              <code>{{ log }}</code>
            </div>
          </div>
        </section>
      </xy-splitter-panel>
    </xy-splitter>
  </div>
</template>

<style scoped>
.demo-splitter-vertical {
  height: 336px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 90%, white);
  border-radius: 24px;
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--xy-color-primary) 7%, white), transparent 36%),
    #fbfcfe;
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.08);
}

.demo-splitter-vertical__chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 84%, white);
  background: color-mix(in srgb, var(--xy-bg-color) 84%, white);
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.demo-splitter-terminal {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
}

.demo-splitter-terminal--top {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color-muted) 88%, white), transparent 22%),
    color-mix(in srgb, var(--xy-bg-color-muted) 74%, white);
}

.demo-splitter-terminal--bottom {
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.92)),
    rgba(15, 23, 42, 0.96);
  color: rgba(226, 232, 240, 0.92);
}

.demo-splitter-terminal__title {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-splitter-terminal__title :deep(p) {
  margin: 0;
}

.demo-splitter-task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  overflow: auto;
}

.demo-splitter-task {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 11px 12px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 14px;
  background: color-mix(in srgb, var(--xy-bg-color) 82%, white);
  color: var(--xy-text-color-secondary);
  text-align: left;
}

.demo-splitter-task span {
  color: var(--xy-text-color-muted);
  font-family: "SFMono-Regular", "SF Mono", Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
}

.demo-splitter-task.is-active {
  border-color: color-mix(in srgb, var(--xy-color-primary) 24%, white);
  background: color-mix(in srgb, var(--xy-color-primary) 8%, white);
  color: var(--xy-text-color);
}

.demo-splitter-log {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
  min-height: 0;
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.36);
  overflow: auto;
}

.demo-splitter-log__line {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  font-family: "SFMono-Regular", "SF Mono", Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
}

.demo-splitter-log__line span {
  color: rgba(148, 163, 184, 0.72);
}

.demo-splitter-log__line code {
  color: rgba(226, 232, 240, 0.9);
  white-space: nowrap;
}

@media (max-width: 720px) {
  .demo-splitter-vertical__chrome,
  .demo-splitter-terminal__title {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
