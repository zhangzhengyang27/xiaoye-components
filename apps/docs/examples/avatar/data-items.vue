<script setup lang="ts">
const members = [
  {
    key: "xiaoye",
    text: "叶"
  },
  {
    key: "mavis",
    icon: "mdi:account-outline"
  },
  {
    key: "luna",
    src: "https://example.com/avatar.png",
    alt: "luna avatar"
  }
];
</script>

<template>
  <xy-avatar-group :items="members" />
</template>
