<script setup lang="ts">
const options = [
  { label: "北京市", value: "beijing" },
  { label: "天津市", value: "tianjin" },
  { label: "上海市", value: "shanghai" },
  { label: "重庆市", value: "chongqing" }
];
</script>

<template>
  <xyu-cascader v-model="[]" :options="options" :props="{ checkStrictly: true }" placeholder="可选择任意级别" style="width: 240px" />
</template>
