<script setup lang="ts">
import { ref } from "vue";
import { defineTableColumns } from "xiaoye-components";

interface MemberRow {
  id: number;
  name: string;
  role: string;
  status: "值班中" | "已下线";
}

const rows: MemberRow[] = [
  { id: 1, name: "王新宇", role: "运营负责人", status: "值班中" },
  { id: 2, name: "林星河", role: "交付经理", status: "值班中" },
  { id: 3, name: "沈知行", role: "财务审核", status: "已下线" }
];

const columns = defineTableColumns<MemberRow>([
  { key: "name", title: "姓名", dataIndex: "name" },
  { key: "role", title: "岗位", dataIndex: "role" },
  { key: "status", title: "状态", dataIndex: "status", slot: "status" },
  { key: "actions", title: "操作", slot: "actions", align: "right" }
]);

const moreActions = [
  { key: "copy", label: "复制成员信息" },
  { key: "archive", label: "归档账号", danger: true }
];
const lastAction = ref("暂无操作");

function handleQuickAction(row: MemberRow, action: string) {
  lastAction.value = `${row.name}：${action}`;
}

function handleMoreAction(row: MemberRow, item: { label: string }) {
  lastAction.value = `${row.name}：${item.label}`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-table :columns="columns" :data="rows" row-key="id">
      <template #cell-status="{ value }">
        <xy-tag :status="value === '值班中' ? 'success' : 'neutral'">{{ value }}</xy-tag>
      </template>

      <template #cell-actions="{ row }">
        <xy-space>
          <xy-button plain @click="handleQuickAction(row, '查看详情')">查看</xy-button>
          <xy-button plain @click="handleQuickAction(row, '编辑角色')">编辑</xy-button>
          <xy-dropdown :items="moreActions" @select="handleMoreAction(row, $event)">
            <xy-button plain>更多</xy-button>
          </xy-dropdown>
        </xy-space>
      </template>
    </xy-table>

    <xy-tag status="primary">最近操作：{{ lastAction }}</xy-tag>
  </div>
</template>
