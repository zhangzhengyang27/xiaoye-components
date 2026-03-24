<script setup lang="ts">
import { computed, ref, watch } from "vue";

interface RowItem {
  id: number;
  name: string;
  status: "进行中" | "待处理";
}

const rows: RowItem[] = [
  { id: 1, name: "线索清洗", status: "进行中" },
  { id: 2, name: "合同补录", status: "待处理" },
  { id: 3, name: "权限复核", status: "进行中" },
  { id: 4, name: "账号迁移", status: "待处理" },
  { id: 5, name: "工单收口", status: "进行中" }
];

const keyword = ref("");
const status = ref<"all" | RowItem["status"]>("all");
const currentPage = ref(3);
const pageSize = ref(10);

const filteredRows = computed(() =>
  rows.filter((row) => {
    const matchesKeyword =
      keyword.value.trim().length === 0 || row.name.includes(keyword.value.trim());
    const matchesStatus = status.value === "all" || row.status === status.value;

    return matchesKeyword && matchesStatus;
  })
);

watch([keyword, status], () => {
  currentPage.value = 1;
});
</script>

<template>
  <div class="xy-doc-stack">
    <xy-input v-model="keyword" placeholder="输入关键字后自动重置到第 1 页" />

    <xy-space wrap>
      <xy-button plain :type="status === 'all' ? 'primary' : 'default'" @click="status = 'all'">
        全部
      </xy-button>
      <xy-button
        plain
        :type="status === '进行中' ? 'primary' : 'default'"
        @click="status = '进行中'"
      >
        进行中
      </xy-button>
      <xy-button
        plain
        :type="status === '待处理' ? 'primary' : 'default'"
        @click="status = '待处理'"
      >
        待处理
      </xy-button>
    </xy-space>

    <xy-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="filteredRows.length"
    />

    <xy-tag status="primary">
      当前页：{{ currentPage }} / 结果数：{{ filteredRows.length }}
    </xy-tag>
  </div>
</template>
