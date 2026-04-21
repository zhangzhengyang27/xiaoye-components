<script setup lang="ts">
const options = [
  { label: "北京市", value: "beijing", children: [
    { label: "朝阳区", value: "chaoyang" },
    { label: "海淀区", value: "haidian" }
  ]},
  { label: "上海市", value: "shanghai", children: [
    { label: "浦东新区", value: "pudong" },
    { label: "徐汇区", value: "xuhui" }
  ]}
];
</script>

<template>
  <xyu-cascader v-model="[]" :options="options" disabled placeholder="禁用状态" style="width: 240px" />
</template>
