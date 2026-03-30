<script setup lang="ts">
import { reactive } from "vue";
import type { ProTableColumn, SearchFormField } from "@xiaoye/pro-components";

const searchModel = reactive({
  keyword: ""
});

const searchFields: SearchFormField[] = [
  {
    prop: "keyword",
    label: "关键词",
    component: "input"
  }
];

const columns: ProTableColumn[] = [
  {
    type: "selection",
    width: 52
  },
  {
    prop: "name",
    label: "名称"
  },
  {
    prop: "owner",
    label: "负责人"
  }
];

const rows = [
  {
    id: 1,
    name: "成员档案补录",
    owner: "小叶"
  },
  {
    id: 2,
    name: "账单核对",
    owner: "Mavis"
  }
];
</script>

<template>
  <xy-list-page
    title="成员工作台"
    description="列表页容器负责把搜索、列表和批量动作组织起来。"
    :search-model="searchModel"
    :search-fields="searchFields"
    :data="rows"
    :columns="columns"
    :toolbar-actions="[{ key: 'create', label: '新建', type: 'primary' }]"
    :batch-actions="[{ key: 'archive', label: '批量归档' }]"
  />
</template>
