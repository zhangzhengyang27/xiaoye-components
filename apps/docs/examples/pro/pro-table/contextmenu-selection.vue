<script setup lang="ts">
import { ref } from "vue";
import type { ProTableColumn } from "@xiaoye/pro-components";

interface Row {
  id: number;
  name: string;
  owner: string;
  status: "启用" | "停用";
}

const selected = ref<Row[]>([]);
const rows: Row[] = [
  {
    id: 1,
    name: "发票审批台",
    owner: "小叶",
    status: "启用"
  },
  {
    id: 2,
    name: "结算复核台",
    owner: "小星",
    status: "停用"
  }
];

const columns: ProTableColumn<Row>[] = [
  {
    prop: "name",
    label: "名称",
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
    minWidth: 120
  }
];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <xy-alert
      type="info"
      title="试试右键表格行，或在表格底部点击确认选择。"
      :closable="false"
      show-icon
    />

    <xy-pro-table
      title="右键与选择链路"
      description="把右键菜单和表格选择器统一放到同一个增强表格里。"
      :data="rows"
      :columns="columns"
      :contextmenu="{
        rowItems: [
          { key: 'detail', label: '查看详情' },
          { key: 'archive', label: '归档' }
        ]
      }"
      :table-select="{
        enabled: true,
        mode: 'multiple',
        title: '人员选择器',
        description: '当前示例把选择链路收进了 ProTable。'
      }"
      :table-props="{ rowKey: 'id' }"
      @table-select-confirm="selected = $event"
    />

    <xy-tag status="primary">已确认 {{ selected.length }} 项</xy-tag>
  </div>
</template>
