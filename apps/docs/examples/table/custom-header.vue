<script setup lang="ts">
import { computed, ref } from "vue";

interface ContactRow {
  id: number;
  name: string;
  team: string;
  email: string;
}

const keyword = ref("");
const rows: ContactRow[] = [
  { id: 1, name: "王见川", team: "商业化", email: "wang@xiaoye.design" },
  { id: 2, name: "林星河", team: "基础平台", email: "lin@xiaoye.design" },
  { id: 3, name: "沈知行", team: "财务中台", email: "shen@xiaoye.design" }
];

const filteredRows = computed(() => {
  const value = keyword.value.trim().toLowerCase();

  if (!value) {
    return rows;
  }

  return rows.filter((row) => {
    return [row.name, row.team, row.email].some((field) => field.toLowerCase().includes(value));
  });
});
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-toolbar">
      <div class="xy-table-doc-toolbar__group">
        <div class="xy-table-doc-toolbar__chip">
          <span>header slot</span>
          <strong>enabled</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>search</span>
          <strong>{{ keyword || "all rows" }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>rows</span>
          <strong>{{ filteredRows.length }}</strong>
        </div>
      </div>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table :data="filteredRows" row-key="id" border>
        <xy-table-column prop="name" label="姓名" min-width="110" />
        <xy-table-column prop="team" label="团队" min-width="120" />
        <xy-table-column prop="email" min-width="210" show-overflow-tooltip>
          <template #header>
            <div class="table-custom-header">
              <span>邮箱</span>
              <xy-input v-model="keyword" size="sm" placeholder="搜索成员 / 团队 / 邮箱" />
            </div>
          </template>
        </xy-table-column>
      </xy-table>
    </div>
  </div>
</template>

<style scoped>
.table-custom-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.table-custom-header span {
  flex-shrink: 0;
}

.table-custom-header :deep(.xy-input) {
  min-width: 140px;
}
</style>
