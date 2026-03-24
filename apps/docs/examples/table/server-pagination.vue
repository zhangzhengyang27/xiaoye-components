<script setup lang="ts">
import { onMounted, ref } from "vue";
import { defineTableColumns } from "xiaoye-components";

interface ProjectRow {
  id: number;
  name: string;
  owner: string;
  status: "上线中" | "排期中" | "已归档";
}

const allRows: ProjectRow[] = Array.from({ length: 36 }, (_, index) => ({
  id: index + 1,
  name: `项目 ${String(index + 1).padStart(2, "0")}`,
  owner: ["Xiaoye", "Alice", "Jason"][index % 3] as ProjectRow["owner"],
  status: ["上线中", "排期中", "已归档"][index % 3] as ProjectRow["status"]
}));

const columns = defineTableColumns<ProjectRow>([
  { key: "name", title: "项目名称", dataIndex: "name" },
  { key: "owner", title: "负责人", dataIndex: "owner" },
  { key: "status", title: "状态", dataIndex: "status", slot: "status" }
]);

const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(6);
const rows = ref<ProjectRow[]>([]);

async function requestRows(page = currentPage.value, size = pageSize.value) {
  loading.value = true;

  await new Promise((resolve) => {
    window.setTimeout(resolve, 520);
  });

  const start = (page - 1) * size;
  rows.value = allRows.slice(start, start + size);
  loading.value = false;
}

async function handlePagerChange(page: number, size: number) {
  currentPage.value = page;
  pageSize.value = size;
  await requestRows(page, size);
}

onMounted(() => {
  void requestRows();
});
</script>

<template>
  <div class="xy-doc-stack">
    <xy-tag status="primary"> 请求参数：page={{ currentPage }} / pageSize={{ pageSize }} </xy-tag>

    <xy-table
      :columns="columns"
      :data="rows"
      :loading="loading"
      row-key="id"
      loading-text="正在同步当前页数据"
    >
      <template #cell-status="{ value }">
        <xy-tag
          :status="value === '上线中' ? 'success' : value === '排期中' ? 'warning' : 'neutral'"
        >
          {{ value }}
        </xy-tag>
      </template>
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
