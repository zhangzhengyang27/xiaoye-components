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
  <xyu-space direction="vertical">
    <xyu-cascader v-model="['beijing', 'chaoyang']" :options="options" clearable placeholder="选择城市" style="width: 240px" />
  </xyu-space>
</template>
