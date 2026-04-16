<script setup lang="ts">
const files = [
  { name: "splitter.md", type: "md" },
  { name: "splitter.vue", type: "vue", active: true },
  { name: "split-bar.vue", type: "vue" },
  { name: "splitter.css", type: "css" }
];

const codeLines = [
  { num: 1, code: "<template>" },
  { num: 2, code: "  <xy-splitter>" },
  { num: 3, code: "    <xy-splitter-panel>" },
  { num: 4, code: "      <aside>Sidebar</aside>", highlight: true },
  { num: 5, code: "    </xy-splitter-panel>" },
  { num: 6, code: "    <xy-splitter-panel>" },
  { num: 7, code: "      <main>Content</main>" },
  { num: 8, code: "    </xy-splitter-panel>" },
  { num: 9, code: "  </xy-splitter>" },
  { num: 10, code: "</template>" }
];
</script>

<template>
  <div class="split-demo split-demo--ide">
    <xy-splitter>
      <xy-splitter-panel size="260px" :min="180">
        <div class="split-demo__sidebar">
          <div class="split-demo__section">
            <div class="split-demo__label">Explorer</div>
            <div class="split-demo__files">
              <button
                v-for="file in files"
                :key="file.name"
                class="split-demo__file"
                :class="{ 'is-active': file.active }"
              >
                <span class="split-demo__icon">{{ file.type }}</span>
                <span>{{ file.name }}</span>
              </button>
            </div>
          </div>
          <div class="split-demo__section split-demo__section--outline">
            <div class="split-demo__label">Outline</div>
            <div class="split-demo__outline">
              <span class="split-demo__outline-item">props</span>
              <span class="split-demo__outline-item">emits</span>
              <span class="split-demo__outline-item">template</span>
            </div>
          </div>
        </div>
      </xy-splitter-panel>

      <xy-splitter-panel :min="320">
        <div class="split-demo__main">
          <div class="split-demo__tabs">
            <button
              v-for="file in files.filter((f) => f.active)"
              :key="file.name"
              class="split-demo__tab is-active"
            >
              {{ file.name }}
            </button>
          </div>
          <div class="split-demo__editor">
            <div
              v-for="line in codeLines"
              :key="line.num"
              class="split-demo__line"
              :class="{ 'is-highlight': line.highlight }"
            >
              <span class="split-demo__num">{{ line.num }}</span>
              <code>{{ line.code }}</code>
            </div>
          </div>
        </div>
      </xy-splitter-panel>
    </xy-splitter>
  </div>
</template>

<style scoped>
.split-demo--ide {
  height: 340px;
  margin: -24px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--xy-border-color-subtle);
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 82%, white);
  box-shadow: var(--xy-shadow-xs);
}

.split-demo__sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 16px;
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 88%, white);
}

.split-demo__section {
  min-height: 0;
}

.split-demo__section--outline {
  margin-top: auto;
}

.split-demo__label {
  margin-bottom: 10px;
  color: var(--xy-text-color-secondary);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.split-demo__files {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.split-demo__file {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.split-demo__file:hover {
  background: var(--xy-bg-color-subtle);
  color: var(--xy-text-color-heading);
}

.split-demo__file.is-active {
  background: color-mix(in srgb, var(--xy-color-primary-soft) 68%, white);
  color: var(--xy-color-primary);
}

.split-demo__icon {
  width: 22px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: color-mix(in srgb, var(--xy-surface-raised) 92%, white);
  color: var(--xy-text-color-subtle);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
}

.split-demo__file.is-active .split-demo__icon {
  background: color-mix(in srgb, var(--xy-color-primary-soft) 78%, white);
  color: var(--xy-color-primary);
}

.split-demo__outline {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.split-demo__outline-item {
  padding: 6px 10px;
  border-radius: 6px;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.split-demo__main {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--xy-surface-raised);
}

.split-demo__tabs {
  display: flex;
  gap: 2px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--xy-border-color-subtle);
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white);
}

.split-demo__tab {
  padding: 8px 14px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  cursor: pointer;
}

.split-demo__tab.is-active {
  background: var(--xy-surface-raised);
  color: var(--xy-text-color-heading);
  box-shadow: var(--xy-shadow-xs);
}

.split-demo__editor {
  flex: 1;
  padding: 16px 20px;
  overflow: auto;
}

.split-demo__line {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: "SF Mono", "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  color: var(--xy-text-color-secondary);
}

.split-demo__line.is-highlight {
  background: color-mix(in srgb, var(--xy-color-primary-soft) 52%, white);
  color: var(--xy-text-color-heading);
}

.split-demo__num {
  color: var(--xy-text-color-subtle);
  text-align: right;
}

@media (max-width: 640px) {
  .split-demo--ide {
    height: 420px;
  }
}
</style>
