<script setup lang="ts">
const columns = [
  { key: "name", title: "项目名称", dataIndex: "name", width: 180 },
  { key: "owner", title: "负责人", dataIndex: "owner", width: 140 },
  { key: "env", title: "环境", dataIndex: "env", width: 120 },
  { key: "region", title: "区域", dataIndex: "region", width: 140 },
  { key: "updatedAt", title: "最近更新", dataIndex: "updatedAt", width: 160 },
  { key: "status", title: "状态", dataIndex: "status", width: 120, slot: "status" }
];

const rows = [
  {
    id: 1,
    name: "Billing Console",
    owner: "Xiaoye",
    env: "Production",
    region: "ap-southeast-1",
    updatedAt: "2026-03-23 10:12",
    status: "已上线"
  },
  {
    id: 2,
    name: "Sales Admin",
    owner: "Alice",
    env: "Staging",
    region: "cn-hangzhou",
    updatedAt: "2026-03-23 09:45",
    status: "开发中"
  },
  {
    id: 3,
    name: "Review Center",
    owner: "Bob",
    env: "Production",
    region: "eu-central-1",
    updatedAt: "2026-03-22 18:26",
    status: "待确认"
  }
];
</script>

<template>
  <xy-scrollbar>
    <div class="demo-scroll-table">
      <xy-table :columns="columns" :data="rows" row-key="id">
        <template #cell-status="{ value }">
          <xy-tag
            :status="value === '已上线' ? 'success' : value === '开发中' ? 'primary' : 'warning'"
          >
            {{ value }}
          </xy-tag>
        </template>
      </xy-table>
    </div>
  </xy-scrollbar>
</template>

<style scoped>
.demo-scroll-table {
  width: 980px;
  min-width: max-content;
  padding-bottom: 12px;
}
</style>
