<script setup lang="ts">
const src = "http://localhost:5175/?scene=scheduler";
</script>

<template>
  <div class="scheduler-frame">
    <div class="scheduler-frame__bar">
      <div>
        <strong>完整交互场景</strong>
        <p>先运行 `pnpm dev:playground`，再在这里验证完整的 `xy-scheduler` 场景链路。</p>
      </div>
      <a :href="src" target="_blank" rel="noreferrer">新窗口打开</a>
    </div>

    <div class="scheduler-frame__hint">
      如果下方显示空白、无法连接或浏览器错误页，通常说明本地 `playground` 还没有启动。先运行 `pnpm
      dev:playground`，再刷新当前页面。
    </div>

    <iframe class="scheduler-frame__iframe" :src="src" title="Scheduler Playground" />
  </div>
</template>

<style scoped>
.scheduler-frame {
  margin-top: 18px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-xl);
  overflow: hidden;
  background: var(--xy-surface-raised);
  box-shadow: var(--xy-shadow-card);
}

.scheduler-frame__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--xy-border-color-subtle);
  background: color-mix(in srgb, var(--xy-color-primary-soft) 34%, white);
}

.scheduler-frame__bar strong {
  display: block;
  margin-bottom: 4px;
  color: var(--xy-text-color-heading);
}

.scheduler-frame__bar p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 14px;
}

.scheduler-frame__bar a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 14%, var(--xy-border-color-subtle));
  background: color-mix(in srgb, var(--xy-color-primary-soft) 56%, white);
  color: var(--xy-color-primary);
  font-weight: 600;
  text-decoration: none;
}

.scheduler-frame__hint {
  padding: 12px 18px;
  border-bottom: 1px solid var(--xy-border-color-subtle);
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white);
  color: var(--xy-text-color-secondary);
  font-size: 14px;
}

.scheduler-frame__iframe {
  width: 100%;
  min-height: 920px;
  border: 0;
  background: var(--xy-bg-color);
}

@media (max-width: 960px) {
  .scheduler-frame__bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .scheduler-frame__iframe {
    min-height: 1100px;
  }
}
</style>
