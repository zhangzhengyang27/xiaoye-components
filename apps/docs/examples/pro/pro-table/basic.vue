<script setup lang="ts">
import type { ProTableColumn } from "@xiaoye/pro-components";

interface Row {
  id: number;
  name: string;
  owner: string;
  status: "启用" | "停用";
}

const rows: Row[] = [
  {
    id: 1,
    name: "账单中心",
    owner: "小叶",
    status: "启用"
  },
  {
    id: 2,
    name: "成员工作台",
    owner: "小星",
    status: "停用"
  }
];

const columns: ProTableColumn<Row>[] = [
  {
    key: "base",
    label: "基础信息",
    children: [
      {
        prop: "name",
        label: "名称",
        minWidth: 220
      },
      {
        prop: "owner",
        label: "负责人",
        minWidth: 120,
        hidden: true
      }
    ]
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
    title="成员列表"
    description="统一把工具栏动作、列表列定义和分页联动放在一个增强组件里。"
    :data="rows"
    :columns="columns"
    :toolbar-actions="[
      { key: 'create', label: '新建成员', type: 'primary' },
      { key: 'export', label: '导出', plain: true }
    ]"
    :total="36"
    :table-props="{ rowKey: 'id' }"
  >
    <template #toolbar-left>
      <xy-tag status="primary">已接入工具栏插槽</xy-tag>
    </template>
    <template #status="{ row }">
      <xy-tag :status="row.status === '启用' ? 'success' : 'warning'">
        {{ row.status }}
      </xy-tag>
    </template>
  </xy-pro-table>
</template>
