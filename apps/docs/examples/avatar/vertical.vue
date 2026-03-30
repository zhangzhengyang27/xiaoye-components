<script setup lang="ts">
const members = [
  { key: "xiaoye", text: "叶" },
  { key: "luna", text: "陆" },
  { key: "mavis", icon: "mdi:account-outline" }
];
</script>

<template>
  <xy-avatar-group :items="members" direction="vertical" :gutter="10" />
</template>
