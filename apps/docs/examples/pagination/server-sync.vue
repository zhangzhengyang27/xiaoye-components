<script setup lang="ts">
import { computed, ref } from "vue";

const currentPage = ref(2);
const pageSize = ref(20);

const requestParams = computed(() => ({
  page: currentPage.value,
  pageSize: pageSize.value,
  offset: (currentPage.value - 1) * pageSize.value,
  limit: pageSize.value
}));
</script>

<template>
  <div class="xy-doc-stack">
    <xy-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="286" />

    <xy-tag status="primary">当前请求参数</xy-tag>
    <pre
      style="
        margin: 0;
        padding: 12px 14px;
        border-radius: 12px;
        background: #0f172a;
        color: #e2e8f0;
        overflow: auto;
      "
      >{{ JSON.stringify(requestParams, null, 2) }}</pre
    >
  </div>
</template>
