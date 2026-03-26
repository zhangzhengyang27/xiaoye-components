<script setup lang="ts">
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
      <xy-table :data="rows" row-key="id">
        <xy-table-column prop="name" label="项目名称" width="180" show-overflow-tooltip />
        <xy-table-column prop="owner" label="负责人" width="140" />
        <xy-table-column prop="env" label="环境" width="120" />
        <xy-table-column prop="region" label="区域" width="140" show-overflow-tooltip />
        <xy-table-column prop="updatedAt" label="最近更新" width="160" />
        <xy-table-column prop="status" label="状态" width="120">
          <template #default="{ value }">
            <xy-tag
              :status="value === '已上线' ? 'success' : value === '开发中' ? 'primary' : 'warning'"
            >
              {{ value }}
            </xy-tag>
          </template>
        </xy-table-column>
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
