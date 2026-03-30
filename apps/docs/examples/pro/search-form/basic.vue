<script setup lang="ts">
import { reactive } from "vue";
import type { SearchFormField } from "@xiaoye/pro-components";

const model = reactive({
  keyword: "账单中心",
  status: "all",
  owner: ""
});

const fields: SearchFormField[] = [
  {
    prop: "keyword",
    label: "关键词",
    component: "input",
    componentProps: {
      placeholder: "按名称 / 编号搜索"
    },
    span: 2
  },
  {
    prop: "status",
    label: "状态",
    component: "select",
    options: [
      { label: "全部", value: "all" },
      { label: "启用", value: "enabled" },
      { label: "停用", value: "disabled" }
    ]
  },
  {
    prop: "owner",
    label: "负责人",
    component: "input",
    placeholder: "精确匹配负责人"
  }
];
</script>

<template>
  <xy-search-form :model="model" :fields="fields">
    <template #meta>
      <span>适合列表页顶部筛选栏。</span>
    </template>
  </xy-search-form>
</template>
