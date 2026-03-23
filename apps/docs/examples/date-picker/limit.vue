<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | null>(null);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-date-picker
      v-model="value"
      clearable
      min="2026-03-01"
      max="2026-03-31"
      placeholder="选择 3 月内日期"
    />
    <xy-tag status="warning">限制范围：2026-03-01 至 2026-03-31</xy-tag>
  </div>
</template>
