<script setup lang="ts">
import { ref } from "vue";

const activeKey = ref("overview");
const items = [
  { key: "overview", label: "概览" },
  { key: "members", label: "成员" },
  { key: "billing", label: "账单" }
];
</script>

<template>
  <xy-tabs v-model="activeKey" :items="items">
    <template #default="{ activeItem }">
      <div class="demo-panel">{{ activeItem?.label }} 面板</div>
    </template>
  </xy-tabs>
</template>
