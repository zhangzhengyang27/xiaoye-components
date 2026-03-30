<script setup lang="ts">
import { ref } from "vue";

const sidebarSize = ref(280);

const filters = [
  { label: "Status", value: "Active" },
  { label: "Priority", value: "High" },
  { label: "Assignee", value: "Me" }
];

const items = [
  { id: "DEV-1024", title: "Improve splitter drag feedback", status: "In Progress" },
  { id: "DEV-1027", title: "Add lazy resize mode", status: "Review" },
  { id: "DEV-1031", title: "Fix panel collapse animation", status: "Done" }
];
</script>

<template>
  <div class="split-demo split-demo--inspector">
    <div class="split-demo__status">
      <span>Inspector</span>
      <span class="split-demo__size">Sidebar: {{ Math.round(sidebarSize) }}px</span>
    </div>

    <xy-splitter lazy class="split-demo__splitter">
      <xy-splitter-panel v-model:size="sidebarSize" :min="200" collapsible>
        <div class="split-demo__sidebar">
          <div class="split-demo__filter-head">
            <span>Filters</span>
            <button class="split-demo__btn">Clear</button>
          </div>
          <div class="split-demo__filters">
            <div v-for="f in filters" :key="f.label" class="split-demo__filter">
              <span class="split-demo__filter-label">{{ f.label }}</span>
              <span class="split-demo__filter-value">{{ f.value }}</span>
            </div>
          </div>
          <div class="split-demo__hint">
            Drag the divider or double-click to collapse
          </div>
        </div>
      </xy-splitter-panel>

      <xy-splitter-panel :min="300">
        <div class="split-demo__content">
          <div class="split-demo__list-head">
            <span>Results</span>
            <xy-tag size="sm" round>{{ items.length }} items</xy-tag>
          </div>
          <div class="split-demo__list">
            <div v-for="item in items" :key="item.id" class="split-demo__item">
              <div class="split-demo__item-main">
                <span class="split-demo__item-id">{{ item.id }}</span>
                <span class="split-demo__item-title">{{ item.title }}</span>
              </div>
              <span
                class="split-demo__item-status"
                :class="{
                  'is-progress': item.status === 'In Progress',
                  'is-review': item.status === 'Review',
                  'is-done': item.status === 'Done'
                }"
              >
                {{ item.status }}
              </span>
            </div>
          </div>
        </div>
      </xy-splitter-panel>
    </xy-splitter>
  </div>
</template>

<style scoped>
.split-demo--inspector {
  height: 340px;
  margin: -24px;
  border-radius: 20px;
  overflow: hidden;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.split-demo__status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  font-size: 12px;
  color: #64748b;
}

.split-demo__size {
  font-family: "SF Mono", monospace;
  color: #94a3b8;
}

.split-demo__splitter {
  height: calc(100% - 41px);
}

.split-demo__sidebar {
  height: 100%;
  padding: 16px;
  background: #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.split-demo__filter-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.split-demo__filter-head span {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.split-demo__btn {
  padding: 4px 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #64748b;
  font-size: 12px;
  cursor: pointer;
}

.split-demo__btn:hover {
  background: #e2e8f0;
  color: #334155;
}

.split-demo__filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.split-demo__filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.split-demo__filter-label {
  color: #64748b;
  font-size: 12px;
}

.split-demo__filter-value {
  color: #334155;
  font-size: 12px;
  font-weight: 500;
}

.split-demo__hint {
  margin-top: auto;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
  color: #94a3b8;
  font-size: 12px;
  text-align: center;
}

.split-demo__content {
  height: 100%;
  padding: 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.split-demo__list-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.split-demo__list-head span {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.split-demo__list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
}

.split-demo__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.15s ease;
}

.split-demo__item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.split-demo__item-main {
  min-width: 0;
}

.split-demo__item-id {
  display: block;
  color: #94a3b8;
  font-family: "SF Mono", monospace;
  font-size: 11px;
  margin-bottom: 4px;
}

.split-demo__item-title {
  display: block;
  color: #334155;
  font-size: 13px;
  font-weight: 500;
}

.split-demo__item-status {
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  background: #f1f5f9;
  color: #64748b;
}

.split-demo__item-status.is-progress {
  background: #dbeafe;
  color: #2563eb;
}

.split-demo__item-status.is-review {
  background: #fef3c7;
  color: #d97706;
}

.split-demo__item-status.is-done {
  background: #dcfce7;
  color: #16a34a;
}

@media (max-width: 640px) {
  .split-demo--inspector {
    height: 420px;
  }
}
</style>
