<script setup lang="ts">
import { reactive } from "vue";
import type { SearchFormField } from "@xiaoye/pro-components";

const model = reactive({
  keyword: "",
  status: "processing",
  scene: "待处理",
  owner: "",
  assistant: "",
  date: "2026-03-28"
});

const fields: SearchFormField[] = [
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
      { label: "待处理", value: "processing" },
      { label: "处理中", value: "running" },
      { label: "已归档", value: "done" }
    ]
  },
  {
    prop: "scene",
    label: "场景",
    slot: "scene",
    collapsible: true
  },
  {
    prop: "owner",
    label: "负责人",
    component: "input",
    hidden: (currentModel) => currentModel.scene === "待处理",
    collapsible: true
  },
  {
    prop: "assistant",
    label: "协作人",
    component: "input",
    disabled: (currentModel) => currentModel.status === "running",
    collapsible: true
  },
  {
    prop: "date",
    label: "创建日期",
    component: "date-picker",
    collapsible: true
  }
];
</script>

<template>
  <xy-search-form :model="model" :fields="fields">
    <template #meta>
      <span>普通输入框按 Enter 会直接触发查询，select 和 textarea 不会。</span>
    </template>
    <template #scene="{ value, update }">
      <xy-button-group>
        <xy-button
          :type="value === '待处理' ? 'primary' : 'default'"
          @click="update('待处理')"
        >
          待处理
        </xy-button>
        <xy-button
          :type="value === '已完成' ? 'primary' : 'default'"
          @click="update('已完成')"
        >
          已完成
        </xy-button>
      </xy-button-group>
    </template>
  </xy-search-form>
</template>
