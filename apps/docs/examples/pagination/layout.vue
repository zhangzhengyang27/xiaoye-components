<script setup lang="ts">
import { ref } from "vue";

const currentPage = ref(8);
const pageSize = ref(10);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="286"
      layout="prev, pager, next, ->, total, sizes, jumper"
      background
    >
      <xy-tag status="primary">共 286 条</xy-tag>
    </xy-pagination>
  </div>
</template>
