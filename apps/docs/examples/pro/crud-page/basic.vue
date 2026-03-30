<script setup lang="ts">
import { reactive } from "vue";
import type { ProFieldSchema, ProTableColumn, SearchFormField } from "@xiaoye/pro-components";

const searchModel = reactive({
  keyword: ""
});

const formModel = reactive({
  name: "",
  owner: ""
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
    prop: "name",
    label: "名称"
  },
  {
    prop: "owner",
    label: "负责人"
  },
  {
    key: "actions",
    label: "操作",
    slot: "actions"
  }
];

const formSchema: ProFieldSchema[] = [
  {
    prop: "name",
    label: "名称",
    component: "input"
  },
  {
    prop: "owner",
    label: "负责人",
    component: "input"
  }
];

const rows = [
  {
    id: 1,
    name: "成员档案补录",
    owner: "小叶"
  }
];
</script>

<template>
  <xy-crud-page
    title="成员管理"
    description="CRUD 页面容器适合标准后台操作流。"
    :search-model="searchModel"
    :search-fields="searchFields"
    :data="rows"
    :columns="columns"
    :form-model="formModel"
    :form-schema="formSchema"
  >
    <template #detail="{ row }">
      <xy-card :header="row?.name ?? '详情'">
        这里承接详情内容。
      </xy-card>
    </template>
  </xy-crud-page>
</template>
