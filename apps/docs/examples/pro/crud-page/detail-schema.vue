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

const detailSchema: ProFieldSchema[] = [
  {
    prop: "name",
    label: "名称"
  },
  {
    prop: "owner",
    label: "负责人"
  },
  {
    prop: "status",
    label: "状态",
    valueType: "tag",
    options: [
      {
        label: "审核中",
        value: "reviewing",
        status: "warning"
      }
    ]
  }
];

const rows = [
  {
    id: 1,
    name: "成员档案补录",
    owner: "小叶",
    status: "reviewing"
  }
];
</script>

<template>
  <xy-crud-page
    title="成员管理"
    description="当详情字段本身有稳定 schema 时，不需要再为详情面板重复写一层模板。"
    :search-model="searchModel"
    :search-fields="searchFields"
    :data="rows"
    :columns="columns"
    :form-model="formModel"
    :form-schema="formSchema"
    :detail-schema="detailSchema"
  />
</template>
