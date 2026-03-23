<script setup lang="ts">
const activities = [
  "10:45 完成报表筛选条件同步。",
  "09:30 补齐导出任务埋点和回溯日志。",
  "昨天 18:20 调整详情侧栏字段分组。"
];
</script>

<template>
  <div class="demo-splitter-shell">
    <xy-splitter>
      <xy-splitter-panel size="36%" min="240px">
        <section class="demo-splitter-pane demo-splitter-pane--nav">
          <xy-text tag="strong">项目空间</xy-text>
          <xy-text size="sm" type="info">左侧适合承载导航树、筛选器或列表。</xy-text>
          <div class="demo-splitter-list">
            <button class="demo-splitter-item is-active">Billing Console</button>
            <button class="demo-splitter-item">Contract Center</button>
            <button class="demo-splitter-item">Permission Hub</button>
          </div>
        </section>
      </xy-splitter-panel>

      <xy-splitter-panel min="320px">
        <section class="demo-splitter-pane">
          <header class="demo-splitter-header">
            <div>
              <xy-text tag="strong" type="primary">Billing Console</xy-text>
              <xy-text size="sm" type="info">右侧主内容区可以继续自由组合表格、表单和摘要卡片。</xy-text>
            </div>
            <xy-space>
              <xy-tag status="success" round>运行中</xy-tag>
              <xy-button size="sm">查看详情</xy-button>
            </xy-space>
          </header>

          <div class="demo-splitter-metrics">
            <article>
              <span>今日请求</span>
              <strong>12,480</strong>
            </article>
            <article>
              <span>异常率</span>
              <strong>0.32%</strong>
            </article>
            <article>
              <span>负责人</span>
              <strong>Xiaoye</strong>
            </article>
          </div>

          <div class="demo-splitter-activity">
            <xy-text tag="strong">最近动态</xy-text>
            <ul>
              <li v-for="activity in activities" :key="activity">{{ activity }}</li>
            </ul>
          </div>
        </section>
      </xy-splitter-panel>
    </xy-splitter>
  </div>
</template>

<style scoped>
.demo-splitter-shell {
  height: 360px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 24px;
  overflow: hidden;
  background:
    radial-gradient(
      circle at top right,
      color-mix(in srgb, var(--xy-color-primary) 9%, white),
      transparent 40%
    ),
    var(--xy-bg-color);
}

.demo-splitter-pane {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

.demo-splitter-pane--nav {
  background: color-mix(in srgb, var(--xy-bg-color-muted) 82%, white);
}

.demo-splitter-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-splitter-item {
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 16px;
  background: var(--xy-bg-color);
  color: var(--xy-text-color);
  text-align: left;
}

.demo-splitter-item.is-active {
  border-color: color-mix(in srgb, var(--xy-color-primary) 26%, white);
  background: color-mix(in srgb, var(--xy-color-primary) 8%, white);
}

.demo-splitter-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.demo-splitter-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.demo-splitter-metrics article,
.demo-splitter-activity {
  padding: 16px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 74%, white);
}

.demo-splitter-metrics span {
  display: block;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.demo-splitter-metrics strong {
  display: block;
  margin-top: 8px;
  font-size: 20px;
  color: var(--xy-text-color);
}

.demo-splitter-activity ul {
  margin: 10px 0 0;
  padding-left: 18px;
  color: var(--xy-text-color-secondary);
}

@media (max-width: 720px) {
  .demo-splitter-header,
  .demo-splitter-metrics {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
}
</style>
