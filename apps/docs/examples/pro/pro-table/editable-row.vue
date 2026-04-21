<script setup lang="ts">
import { ref } from "vue";
import type { ProTableColumn, ProTableInstance } from "@xiaoye/pro-components";

interface Row {
  id: number;
  name: string;
  owner: string;
  status: "启用" | "停用";
}

const tableRef = ref<ProTableInstance<Row> | null>(null);
const rows = ref<Row[]>([
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
]);

const columns: ProTableColumn<Row>[] = [
  {
    prop: "name",
    label: "名称",
    editable: true
  },
  {
    prop: "owner",
    label: "负责人",
    editable: true
  },
  {
    prop: "status",
    label: "状态",
    editable: true,
    editor: "select",
    options: [
      {
        label: "启用",
        value: "启用"
      },
      {
        label: "停用",
        value: "停用"
      }
    ]
  }
];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <xy-button-group>
      <xy-button type="primary" @click="tableRef?.startEdit(rows[0])">编辑第一行</xy-button>
      <xy-button @click="tableRef?.cancelEdit()">取消</xy-button>
      <xy-button type="primary" plain @click="tableRef?.submitEdit()">保存</xy-button>
    </xy-button-group>

    <xy-pro-table
      ref="tableRef"
      title="行编辑工作台"
      description="首版把编辑态收进 ProTable，自带草稿缓冲、保存和取消。"
      :data="rows"
      :columns="columns"
      :editable="{ enabled: true, mode: 'row' }"
      :table-props="{ rowKey: 'id' }"
    />
  </div>
</template>
