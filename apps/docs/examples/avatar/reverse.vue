<script setup lang="ts">
const members = [
  { key: "a", text: "甲" },
  { key: "b", text: "乙" },
  { key: "c", text: "丙" },
  { key: "d", text: "丁" }
];
</script>

<template>
  <xy-avatar-group :items="members" :gutter="12" reverse />
</template>
