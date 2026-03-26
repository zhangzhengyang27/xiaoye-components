<script setup lang="ts">
import { ref } from "vue";

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
    <xy-table :data="rows" row-key="id">
      <xy-table-column prop="name" label="姓名" />
      <xy-table-column prop="role" label="岗位" />
      <xy-table-column prop="status" label="状态">
        <template #default="{ value }">
          <xy-tag :status="value === '值班中' ? 'success' : 'neutral'">{{ value }}</xy-tag>
        </template>
      </xy-table-column>
      <xy-table-column label="操作" align="right" width="220">
        <template #default="{ row }">
          <xy-space>
            <xy-button plain @click="handleQuickAction(row, '查看详情')">查看</xy-button>
            <xy-button plain @click="handleQuickAction(row, '编辑角色')">编辑</xy-button>
            <xy-dropdown :items="moreActions" @select="handleMoreAction(row, $event)">
              <xy-button plain>更多</xy-button>
            </xy-dropdown>
          </xy-space>
        </template>
      </xy-table-column>
    </xy-table>

    <xy-tag status="primary">最近操作：{{ lastAction }}</xy-tag>
  </div>
</template>
