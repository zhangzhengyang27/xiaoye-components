<script setup lang="ts">
import { computed, ref } from "vue";
import { defineTableColumns } from "xiaoye-components";

interface ProjectRow {
  id: number;
  name: string;
  owner: string;
  status: "上线中" | "排期中" | "已归档";
  score: number;
}

const rows: ProjectRow[] = [
  { id: 1, name: "订单中心", owner: "Xiaoye", status: "上线中", score: 96 },
  { id: 2, name: "线索看板", owner: "Alice", status: "排期中", score: 88 },
  { id: 3, name: "结算后台", owner: "Jason", status: "已归档", score: 74 },
  { id: 4, name: "权限平台", owner: "Xiaoye", status: "上线中", score: 91 }
];

const columns = defineTableColumns<ProjectRow>([
  { key: "name", title: "项目名称", dataIndex: "name" },
  { key: "owner", title: "负责人", dataIndex: "owner" },
  { key: "status", title: "状态", dataIndex: "status", slot: "status" },
  { key: "score", title: "健康度", dataIndex: "score", align: "right" }
]);

const keyword = ref("");
const statusFilter = ref<"all" | ProjectRow["status"]>("all");
const sortOrder = ref<"score-desc" | "score-asc">("score-desc");

const filteredRows = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase();

  const nextRows = rows.filter((row) => {
    const matchesKeyword =
      normalizedKeyword.length === 0 ||
      row.name.toLowerCase().includes(normalizedKeyword) ||
      row.owner.toLowerCase().includes(normalizedKeyword);
    const matchesStatus = statusFilter.value === "all" || row.status === statusFilter.value;

    return matchesKeyword && matchesStatus;
  });

  return nextRows
    .slice()
    .sort((left, right) =>
      sortOrder.value === "score-desc" ? right.score - left.score : left.score - right.score
    );
});
</script>

<template>
  <div class="xy-doc-stack">
    <xy-input v-model="keyword" placeholder="搜索项目名称或负责人" />

    <xy-space wrap>
      <xy-tag status="neutral">状态筛选</xy-tag>
      <xy-button
        plain
        :type="statusFilter === 'all' ? 'primary' : 'default'"
        @click="statusFilter = 'all'"
      >
        全部
      </xy-button>
      <xy-button
        plain
        :type="statusFilter === '上线中' ? 'primary' : 'default'"
        @click="statusFilter = '上线中'"
      >
        上线中
      </xy-button>
      <xy-button
        plain
        :type="statusFilter === '排期中' ? 'primary' : 'default'"
        @click="statusFilter = '排期中'"
      >
        排期中
      </xy-button>
      <xy-button
        plain
        :type="statusFilter === '已归档' ? 'primary' : 'default'"
        @click="statusFilter = '已归档'"
      >
        已归档
      </xy-button>
    </xy-space>

    <xy-space wrap>
      <xy-tag status="neutral">健康度排序</xy-tag>
      <xy-button
        plain
        :type="sortOrder === 'score-desc' ? 'primary' : 'default'"
        @click="sortOrder = 'score-desc'"
      >
        从高到低
      </xy-button>
      <xy-button
        plain
        :type="sortOrder === 'score-asc' ? 'primary' : 'default'"
        @click="sortOrder = 'score-asc'"
      >
        从低到高
      </xy-button>
    </xy-space>

    <xy-table :columns="columns" :data="filteredRows" row-key="id">
      <template #cell-status="{ value }">
        <xy-tag
          :status="value === '上线中' ? 'success' : value === '排期中' ? 'warning' : 'neutral'"
        >
          {{ value }}
        </xy-tag>
      </template>
    </xy-table>
  </div>
</template>
