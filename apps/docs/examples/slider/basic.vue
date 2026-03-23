<script setup lang="ts">
import { ref } from "vue";

const value = ref(36);
</script>

<template>
  <xy-space align="center" style="width: 100%; max-width: 460px;">
    <xy-slider v-model="value" style="max-width: 340px;" />
    <xy-tag status="primary">当前值：{{ value }}</xy-tag>
  </xy-space>
</template>
