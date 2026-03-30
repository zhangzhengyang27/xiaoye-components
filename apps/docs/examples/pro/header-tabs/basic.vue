<script setup lang="ts">
import { ref } from "vue";

const current = ref("overview");
const items = [
  { key: "overview", label: "概览" },
  { key: "orders", label: "订单", closable: true },
  { key: "members", label: "成员", closable: true }
];
</script>

<template>
  <xy-header-tabs v-model="current" :items="items" />
</template>
