<script setup lang="ts">
import { onMounted, ref } from "vue";

interface ProjectRow {
  id: number;
  name: string;
  owner: string;
  status: "上线中" | "排期中" | "已归档";
  score: number;
}

const allRows: ProjectRow[] = Array.from({ length: 36 }, (_, index) => ({
  id: index + 1,
  name: `项目 ${String(index + 1).padStart(2, "0")}`,
  owner: ["Xiaoye", "Alice", "Jason"][index % 3] as ProjectRow["owner"],
  status: ["上线中", "排期中", "已归档"][index % 3] as ProjectRow["status"],
  score: 100 - index
}));

const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(6);
const rows = ref<ProjectRow[]>([]);
const sortProp = ref<string | undefined>("score");
const sortOrder = ref<"ascending" | "descending" | null>("ascending");

async function requestRows(page = currentPage.value, size = pageSize.value) {
  loading.value = true;

  await new Promise((resolve) => {
    window.setTimeout(resolve, 520);
  });

  const sortedRows = allRows.slice();

  if (sortProp.value === "score" && sortOrder.value) {
    sortedRows.sort((left, right) =>
      sortOrder.value === "ascending" ? left.score - right.score : right.score - left.score
    );
  }

  const start = (page - 1) * size;
  rows.value = sortedRows.slice(start, start + size);
  loading.value = false;
}

async function handlePagerChange(page: number, size: number) {
  currentPage.value = page;
  pageSize.value = size;
  await requestRows(page, size);
}

async function handleSortChange(payload: {
  prop?: string;
  order?: "ascending" | "descending" | null;
}) {
  sortProp.value = payload.prop;
  sortOrder.value = payload.order ?? null;
  currentPage.value = 1;
  await requestRows(1, pageSize.value);
}

onMounted(() => {
  void requestRows();
});
</script>

<template>
  <div class="xy-doc-stack">
    <xy-tag status="primary">
      请求参数：page={{ currentPage }} / pageSize={{ pageSize }} / sort={{ sortProp ?? "none" }} /
      order={{ sortOrder ?? "none" }}
    </xy-tag>

    <xy-table
      :data="rows"
      :loading="loading"
      row-key="id"
      border
      :default-sort="{ prop: 'score', order: 'ascending' }"
      loading-text="正在同步当前页数据"
      @sort-change="handleSortChange"
    >
      <xy-table-column prop="name" label="项目名称" show-overflow-tooltip />
      <xy-table-column prop="owner" label="负责人" />
      <xy-table-column prop="status" label="状态">
        <template #default="{ value }">
          <xy-tag
            :status="value === '上线中' ? 'success' : value === '排期中' ? 'warning' : 'neutral'"
          >
            {{ value }}
          </xy-tag>
        </template>
      </xy-table-column>
      <xy-table-column prop="score" label="健康度" align="right" sortable="custom" />
    </xy-table>

    <xy-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="allRows.length"
      :disabled="loading"
      @change="handlePagerChange"
    />
  </div>
</template>
