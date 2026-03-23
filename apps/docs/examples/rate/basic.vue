<script setup lang="ts">
import { ref } from "vue";

const serviceScore = ref(3);
</script>

<template>
  <xy-space align="center">
    <xy-rate v-model="serviceScore" />
    <xy-tag status="primary">当前评分：{{ serviceScore }}</xy-tag>
  </xy-space>
</template>
