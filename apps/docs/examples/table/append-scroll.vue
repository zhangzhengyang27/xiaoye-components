<script setup lang="ts">
import { ref } from "vue";

interface ScrollRow {
  id: number;
  name: string;
  owner: string;
  status: "启用" | "停用";
  score: number;
}

const rows: ScrollRow[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: `中后台模块 ${index + 1}`,
  owner: index % 2 === 0 ? "Xiaoye" : "Alice",
  status: index % 3 === 0 ? "停用" : "启用",
  score: 100 - index
}));

const scrollState = ref({
  scrollLeft: 0,
  scrollTop: 0
});

function handleScroll(payload: { scrollLeft: number; scrollTop: number }) {
  scrollState.value = payload;
}
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-toolbar">
      <div class="xy-table-doc-toolbar__group">
        <div class="xy-table-doc-toolbar__chip">
          <span>append</span>
          <strong>secondary info</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>scroll</span>
          <strong>event payload</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>height</span>
          <strong>240px</strong>
        </div>
      </div>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table
        :data="rows"
        row-key="id"
        height="240"
        border
        show-summary
        scrollbar-always-on
        @scroll="handleScroll"
      >
        <xy-table-column prop="name" label="模块名称" min-width="220" />
        <xy-table-column prop="owner" label="负责人" min-width="160" />
        <xy-table-column prop="status" label="状态" min-width="160">
          <template #default="{ value }">
            <xy-tag :status="value === '启用' ? 'success' : 'warning'">{{ value }}</xy-tag>
          </template>
        </xy-table-column>
        <xy-table-column prop="score" label="健康度" align="right" min-width="180" />

        <template #append>
          <div class="table-append-bar">
            <div class="table-append-bar__summary">
              <div class="table-append-bar__label">附加区域</div>
              <div class="table-append-bar__text">适合放无限滚动提示、批量统计或二级操作。</div>
            </div>
            <div class="table-append-bar__metrics">
              <span>scrollLeft={{ scrollState.scrollLeft }}</span>
              <span>scrollTop={{ scrollState.scrollTop }}</span>
            </div>
          </div>
        </template>
      </xy-table>
    </div>
  </div>
</template>

<style scoped>
.table-append-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.table-append-bar__summary {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.table-append-bar__label {
  color: #409eff;
  font-size: 12px;
  font-weight: 600;
}

.table-append-bar__text {
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
}

.table-append-bar__metrics {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #909399;
  font-size: 12px;
  white-space: nowrap;
}
</style>
