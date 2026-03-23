<script setup lang="ts">
import { ref } from "vue";

const keyword = ref("");
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-input v-model="keyword" placeholder="请输入关键字" />
      <xy-input placeholder="支持清空" clearable />
    </xy-space>
    <xy-tag status="primary">当前值：{{ keyword || "空" }}</xy-tag>
  </div>
</template>
