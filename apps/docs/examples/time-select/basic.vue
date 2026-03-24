<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | null>("09:30");
</script>

<template>
  <div class="xy-doc-stack">
    <div style="width: 320px; max-width: 100%">
      <xy-time-select v-model="value" clearable />
    </div>

    <xy-space>
      <xy-tag status="primary">当前时间：{{ value ?? "未选择" }}</xy-tag>
    </xy-space>
  </div>
</template>
