<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | number | null>(null);
const options = [
  {
    label: "系统角色",
    options: [
      { label: "管理员", value: "admin", description: "拥有后台管理权限" },
      { label: "访客", value: "guest", description: "仅允许查看基础信息" }
    ]
  },
  {
    label: "业务角色",
    options: [
      { label: "财务", value: "finance", description: "可查看结算与对账信息" },
      { label: "运营", value: "ops", description: "可管理活动和流程配置" }
    ]
  }
];
</script>

<template>
  <div class="xy-doc-field">
    <xy-select
      v-model="value"
      :options="options"
      searchable
      placeholder="请选择角色分组"
    />
  </div>
</template>
