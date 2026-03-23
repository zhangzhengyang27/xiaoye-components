<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | null>("2026-03-22");
</script>

<template>
  <div class="xy-doc-stack">
    <xy-date-picker v-model="value" clearable />
    <xy-tag status="primary">当前日期：{{ value ?? "未选择" }}</xy-tag>
  </div>
</template>
