<script setup lang="ts">
import { reactive, ref } from "vue";
import type { ProFieldSchema } from "@xiaoye/pro-components";

const open = ref(false);
const filterModel = reactive({
  owner: "",
  status: "processing"
});

const fields: ProFieldSchema[] = [
  {
    prop: "owner",
    label: "负责人",
    component: "input"
  },
  {
    prop: "status",
    label: "状态",
    component: "select",
    options: [
      { label: "处理中", value: "processing" },
      { label: "待处理", value: "pending" },
      { label: "已完成", value: "done" }
    ]
  }
];
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-button type="primary" @click="open = true">打开高级筛选</xy-button>

    <xy-table-filter-drawer
      v-model:open="open"
      :model="filterModel"
      :fields="fields"
    />
  </div>
</template>
