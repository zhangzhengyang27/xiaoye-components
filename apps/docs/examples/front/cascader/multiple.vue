<script setup lang="ts">
const options = [
  { label: "水果", value: "fruit", children: [
    { label: "苹果", value: "apple" },
    { label: "香蕉", value: "banana" }
  ]},
  { label: "蔬菜", value: "vegetable", children: [
    { label: "白菜", value: "cabbage" },
    { label: "萝卜", value: "radish" }
  ]}
];
</script>

<template>
  <xyu-cascader v-model="[]" :options="options" :props="{ multiple: true }" placeholder="多选模式" style="width: 360px" />
</template>
