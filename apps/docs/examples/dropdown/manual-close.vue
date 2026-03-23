<script setup lang="ts">
const items = [
  { key: "copy", label: "复制链接" },
  { key: "archive", label: "归档当前条件" }
];
</script>

<template>
  <xy-dropdown :items="items" :close-on-select="false">
    <xy-button plain>选择后保持展开</xy-button>
  </xy-dropdown>
</template>
