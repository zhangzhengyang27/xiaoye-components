<script setup lang="ts">
const files = [
  "apps/docs/components/splitter.md",
  "packages/components/splitter/src/splitter.vue",
  "packages/components/splitter/src/split-bar.vue",
  "packages/theme/src/components/splitter.css"
];

const logs = [
  "20:41 Splitter hover grip tone adjusted.",
  "20:39 Lazy preview line opacity tuned.",
  "20:33 Docs example updated to IDE-like workspace."
];
</script>

<template>
  <div class="demo-splitter-shell">
    <header class="demo-splitter-chrome">
      <div class="demo-splitter-chrome__traffic">
        <span />
        <span />
        <span />
      </div>
      <div class="demo-splitter-chrome__title">
        <strong>Workspace</strong>
        <span>Splitter Playground</span>
      </div>
      <xy-space size="sm">
        <xy-tag size="sm" status="success" round>Preview Ready</xy-tag>
        <xy-button size="sm" text bg>Publish</xy-button>
      </xy-space>
    </header>

    <div class="demo-splitter-stage">
      <xy-splitter>
        <xy-splitter-panel size="33%" min="240px">
          <aside class="demo-splitter-pane demo-splitter-pane--sidebar">
            <div class="demo-splitter-pane__header">
              <div class="demo-splitter-pane__title">
                <xy-text tag="strong">Explorer</xy-text>
                <xy-text tag="p" size="sm" type="info">
                  左侧像文件树和导航区，而不是普通卡片栏。
                </xy-text>
              </div>
              <span class="demo-splitter-badge">4 files</span>
            </div>

            <div class="demo-splitter-search">search splitter</div>

            <div class="demo-splitter-tree">
              <button
                v-for="(file, index) in files"
                :key="file"
                class="demo-splitter-file"
                :class="{ 'is-active': index === 2 }"
              >
                <span class="demo-splitter-file__dot" />
                <span>{{ file }}</span>
              </button>
            </div>

            <div class="demo-splitter-mini-panel">
              <xy-text tag="strong">Outline</xy-text>
              <ul>
                <li>dragger styles</li>
                <li>lazy preview line</li>
                <li>grip visibility</li>
              </ul>
            </div>
          </aside>
        </xy-splitter-panel>

        <xy-splitter-panel min="360px">
          <section class="demo-splitter-pane demo-splitter-pane--workspace">
            <div class="demo-splitter-tabs">
              <button class="is-active">split-bar.vue</button>
              <button>splitter.css</button>
              <button>splitter.md</button>
            </div>

            <div class="demo-splitter-editor">
              <header class="demo-splitter-editor__header">
                <div class="demo-splitter-editor__title">
                  <xy-text tag="strong" type="primary">packages/components/splitter/src/split-bar.vue</xy-text>
                  <xy-text tag="p" size="sm" type="info">
                    把分隔条放回 IDE 场景后，更容易判断拖拽体验是否顺手。
                  </xy-text>
                </div>
                <xy-space size="sm">
                  <xy-tag size="sm" round>Vue</xy-tag>
                  <xy-tag size="sm" status="success" round>Synced</xy-tag>
                </xy-space>
              </header>

              <div class="demo-splitter-code">
                <div class="demo-splitter-code__line">
                  <span>12</span>
                  <code>const draggerClasses = computed(() => [</code>
                </div>
                <div class="demo-splitter-code__line is-highlight">
                  <span>13</span>
                  <code>  props.active ? "is-active" : "",</code>
                </div>
                <div class="demo-splitter-code__line is-highlight">
                  <span>14</span>
                  <code>  props.lazy ? "is-lazy" : ""</code>
                </div>
                <div class="demo-splitter-code__line">
                  <span>15</span>
                  <code>]);</code>
                </div>
              </div>
            </div>

            <div class="demo-splitter-console">
              <div class="demo-splitter-console__head">
                <xy-text tag="strong">Console</xy-text>
                <span>3 updates</span>
              </div>
              <ul>
                <li v-for="log in logs" :key="log">{{ log }}</li>
              </ul>
            </div>
          </section>
        </xy-splitter-panel>
      </xy-splitter>
    </div>
  </div>
</template>

<style scoped>
.demo-splitter-shell {
  height: 392px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 90%, white);
  border-radius: 24px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color-muted) 72%, white), transparent 18%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.02), transparent 40%),
    var(--xy-bg-color);
  box-shadow: 0 24px 54px rgba(15, 23, 42, 0.08);
}

.demo-splitter-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 82%, white);
  background: color-mix(in srgb, var(--xy-bg-color) 82%, white);
  backdrop-filter: blur(14px);
}

.demo-splitter-chrome__traffic {
  display: inline-flex;
  gap: 8px;
}

.demo-splitter-chrome__traffic span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.demo-splitter-chrome__traffic span:nth-child(1) {
  background: #fb7185;
}

.demo-splitter-chrome__traffic span:nth-child(2) {
  background: #fbbf24;
}

.demo-splitter-chrome__traffic span:nth-child(3) {
  background: #34d399;
}

.demo-splitter-chrome__title {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.demo-splitter-chrome__title strong {
  color: var(--xy-text-color);
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.demo-splitter-stage {
  height: calc(100% - 63px);
}

.demo-splitter-pane {
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.demo-splitter-pane--sidebar {
  padding: 18px 14px 14px 16px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color-muted) 86%, white), transparent 18%),
    color-mix(in srgb, var(--xy-bg-color-muted) 74%, white);
}

.demo-splitter-pane--workspace {
  padding: 12px 14px 14px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--xy-color-primary) 5%, white), transparent 22%),
    var(--xy-bg-color);
}

.demo-splitter-pane__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
}

.demo-splitter-pane__title,
.demo-splitter-editor__title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-splitter-pane__title :deep(p),
.demo-splitter-editor__title :deep(p) {
  margin: 0;
}

.demo-splitter-badge,
.demo-splitter-search {
  display: inline-flex;
  align-items: center;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 999px;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.demo-splitter-badge {
  padding: 6px 10px;
  background: color-mix(in srgb, var(--xy-bg-color) 88%, white);
}

.demo-splitter-search {
  min-height: 34px;
  padding: 0 12px;
  margin-bottom: 14px;
  background: color-mix(in srgb, var(--xy-bg-color) 64%, white);
}

.demo-splitter-tree {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
  overflow: auto;
}

.demo-splitter-file {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--xy-text-color-secondary);
  text-align: left;
}

.demo-splitter-file__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--xy-text-color-muted) 70%, white);
}

.demo-splitter-file.is-active {
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
  color: var(--xy-text-color);
}

.demo-splitter-file.is-active .demo-splitter-file__dot {
  background: var(--xy-color-primary);
}

.demo-splitter-mini-panel {
  margin-top: auto;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 16px;
  background: color-mix(in srgb, var(--xy-bg-color) 68%, white);
}

.demo-splitter-mini-panel ul {
  margin: 10px 0 0;
  padding-left: 18px;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.demo-splitter-tabs {
  display: flex;
  gap: 8px;
  padding-bottom: 12px;
}

.demo-splitter-tabs button {
  padding: 8px 12px;
  border: 1px solid transparent;
  border-radius: 12px 12px 0 0;
  background: transparent;
  color: var(--xy-text-color-secondary);
}

.demo-splitter-tabs button.is-active {
  border-color: color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-bottom-color: transparent;
  background: color-mix(in srgb, var(--xy-bg-color) 90%, white);
  color: var(--xy-text-color);
}

.demo-splitter-editor {
  min-height: 0;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 18px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color) 94%, white), transparent 18%),
    color-mix(in srgb, var(--xy-bg-color) 88%, white);
}

.demo-splitter-editor__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.demo-splitter-code {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  font-size: 13px;
}

.demo-splitter-code__line {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 10px;
  padding: 7px 10px;
  border-radius: 10px;
  color: var(--xy-text-color-secondary);
  font-family: "SFMono-Regular", "SF Mono", Menlo, Monaco, Consolas, monospace;
}

.demo-splitter-code__line span {
  color: var(--xy-text-color-muted);
}

.demo-splitter-code__line.is-highlight {
  background: color-mix(in srgb, var(--xy-color-primary) 8%, white);
  color: var(--xy-text-color);
}

.demo-splitter-console {
  margin-top: auto;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 18px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 70%, white);
}

.demo-splitter-console__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.demo-splitter-console ul {
  margin: 0;
  padding-left: 18px;
  max-height: 74px;
  overflow: auto;
  color: var(--xy-text-color-secondary);
  font-family: "SFMono-Regular", "SF Mono", Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
}

@media (max-width: 720px) {
  .demo-splitter-chrome,
  .demo-splitter-editor__header,
  .demo-splitter-pane__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
