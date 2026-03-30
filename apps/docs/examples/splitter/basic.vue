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
              <span>props</span>
              <span>emits</span>
              <span>template</span>
            </div>
          </div>
        </div>
      </xy-splitter-panel>

      <xy-splitter-panel :min="320">
        <div class="split-demo__main">
          <div class="split-demo__tabs">
            <button
              v-for="file in files.filter(f => f.active)"
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
  background: #0f172a;
}

.split-demo__sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 16px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
}

.split-demo__section {
  min-height: 0;
}

.split-demo__section--outline {
  margin-top: auto;
}

.split-demo__label {
  margin-bottom: 10px;
  color: #64748b;
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
  color: #94a3b8;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.split-demo__file:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #e2e8f0;
}

.split-demo__file.is-active {
  background: rgba(59, 130, 246, 0.15);
  color: #93c5fd;
}

.split-demo__icon {
  width: 22px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  color: #64748b;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
}

.split-demo__file.is-active .split-demo__icon {
  background: rgba(59, 130, 246, 0.25);
  color: #93c5fd;
}

.split-demo__outline {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.split-demo__outline span {
  padding: 6px 10px;
  border-radius: 6px;
  color: #64748b;
  font-size: 12px;
}

.split-demo__main {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #0f172a;
}

.split-demo__tabs {
  display: flex;
  gap: 2px;
  padding: 8px 12px;
  background: #1e293b;
}

.split-demo__tab {
  padding: 8px 14px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
}

.split-demo__tab.is-active {
  background: #0f172a;
  color: #e2e8f0;
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
  color: #94a3b8;
}

.split-demo__line.is-highlight {
  background: rgba(59, 130, 246, 0.1);
  color: #e2e8f0;
}

.split-demo__num {
  color: #475569;
  text-align: right;
}

@media (max-width: 640px) {
  .split-demo--ide {
    height: 420px;
  }
}
</style>
