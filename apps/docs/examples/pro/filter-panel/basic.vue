<script setup lang="ts">
import { reactive } from "vue";
import type { SearchFormField } from "@xiaoye/pro-components";

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
      { label: "处理中", value: "processing" },
      { label: "待跟进", value: "pending" },
      { label: "已完成", value: "done" }
    ]
  }
];
</script>

<template>
  <xy-filter-panel
    title="高级筛选"
    description="把筛选条件和动作区统一包进一块可折叠区域。"
  >
    <xy-search-form :model="searchModel" :fields="searchFields" />

    <template #actions>
      <xy-space>
        <xy-button plain>保存为预设</xy-button>
        <xy-button type="primary">应用筛选</xy-button>
      </xy-space>
    </template>
  </xy-filter-panel>
</template>
