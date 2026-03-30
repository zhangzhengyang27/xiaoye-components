<script setup lang="ts">
import { ref } from "vue";

const files = ref([]);
</script>

<template>
  <xy-upload v-model:file-list="files" directory multiple tip="支持选择整个目录" />
</template>
