<script setup lang="ts">
import { ref } from "vue";

const amount = ref("10000");

function formatter(value: string) {
  if (!value) {
    return "";
  }

  return `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function parser(value: string) {
  return value.replace(/[¥,\s]/g, "");
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-input v-model="amount" :formatter="formatter" :parser="parser" placeholder="请输入预算" />
    <xy-tag status="primary">当前值：{{ amount || "空" }}</xy-tag>
  </div>
</template>
