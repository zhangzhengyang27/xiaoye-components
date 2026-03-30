<script setup lang="ts">
import { reactive } from "vue";
import type { ProTableColumn, SearchFormField } from "@xiaoye/pro-components";

interface Row {
  id: number;
  name: string;
  owner: string;
  status: "待处理" | "处理中" | "已完成";
}

const searchModel = reactive({
  keyword: "",
  status: "processing"
});

const searchFields: SearchFormField[] = [
  {
    prop: "keyword",
    label: "关键词",
    component: "input",
    span: 2
  },
  {
    prop: "status",
    label: "状态",
    component: "select",
    options: [
      { label: "待处理", value: "pending" },
      { label: "处理中", value: "processing" },
      { label: "已完成", value: "done" }
    ]
  }
];

const rows: Row[] = [
  {
    id: 1,
    name: "发票审批",
    owner: "小叶",
    status: "待处理"
  },
  {
    id: 2,
    name: "结算复核",
    owner: "小星",
    status: "处理中"
  }
];

const columns: ProTableColumn<Row>[] = [
  {
    prop: "name",
    label: "任务名",
    minWidth: 220
  },
  {
    prop: "owner",
    label: "负责人",
    minWidth: 120
  },
  {
    prop: "status",
    label: "状态",
    slot: "status",
    minWidth: 120
  }
];
</script>

<template>
  <xy-pro-table
    title="任务看板"
    description="把搜索栏、列表和分页放回同一个后台闭环里。"
    :data="rows"
    :columns="columns"
    :total="24"
    :table-props="{ rowKey: 'id' }"
  >
    <template #toolbar-right>
      <xy-button plain>导出列表</xy-button>
    </template>
    <template #search>
      <xy-search-form :model="searchModel" :fields="searchFields" />
    </template>
    <template #status="{ row }">
      <xy-tag
        :status="row.status === '已完成' ? 'success' : row.status === '处理中' ? 'primary' : 'warning'"
      >
        {{ row.status }}
      </xy-tag>
    </template>
    <template #footer-meta>
      <span>当前仅展示后台列表页主干能力。</span>
    </template>
  </xy-pro-table>
</template>
