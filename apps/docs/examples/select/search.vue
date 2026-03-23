<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | number | null>(null);
const options = [
  { label: "管理员", value: "admin", description: "拥有后台管理权限" },
  { label: "成员", value: "member", description: "可查看和编辑业务数据" },
  { label: "访客", value: "guest", disabled: true, description: "当前不可被选择" }
];
</script>

<template>
  <div class="xy-doc-stack">
    <xy-select
      v-model="value"
      :options="options"
      searchable
      clearable
      placeholder="角色筛选"
      no-match-text="没有符合条件的角色"
    />
    <xy-tag :status="value ? 'success' : 'neutral'">当前筛选：{{ value ?? "未选择" }}</xy-tag>
  </div>
</template>
