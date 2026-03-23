<script setup lang="ts">
import { ref } from "vue";

const currentPage = ref(3);
const pageSize = ref(20);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="86"
    />
    <xy-tag status="primary">第 {{ currentPage }} 页 / 每页 {{ pageSize }} 条</xy-tag>
  </div>
</template>
