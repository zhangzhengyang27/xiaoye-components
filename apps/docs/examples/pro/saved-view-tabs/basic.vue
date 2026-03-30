<script setup lang="ts">
import { ref } from "vue";

type ViewKey = "pending" | "mine" | "risk";

const activeKey = ref<ViewKey>("pending");
const items = [
  { key: "pending", label: "待处理账单", count: 12 },
  { key: "mine", label: "我负责", count: 7 },
  { key: "risk", label: "异常单", count: 2, closable: true }
];

const currentViewMap = {
  pending: {
    title: "待处理账单队列",
    summary: "优先处理本周新增的供应商差异账单。"
  },
  mine: {
    title: "我负责的账单",
    summary: "适合运营负责人持续跟进当前自己的账单链路。"
  },
  risk: {
    title: "异常单工作区",
    summary: "适合聚焦金额异常、附件缺失和重复导入问题。"
  }
} as const;
</script>

<template>
  <xy-saved-view-tabs v-model:active-key="activeKey" :items="items" addable>
    <xy-card :header="currentViewMap[activeKey].title">
      <p>{{ currentViewMap[activeKey].summary }}</p>
      <xy-space>
        <xy-tag status="warning">待复核 4</xy-tag>
        <xy-tag status="danger">P0 差异 1</xy-tag>
        <xy-tag status="primary">需补附件 3</xy-tag>
      </xy-space>
    </xy-card>
  </xy-saved-view-tabs>
</template>
