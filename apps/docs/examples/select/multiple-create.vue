<script setup lang="ts">
import { ref } from "vue";

const value = ref<Array<string | number>>([1]);
const options = ref([
  { label: "管理员", value: 1 },
  { label: "成员", value: 2 }
]);
</script>

<template>
  <xy-select
    v-model="value"
    multiple
    allow-create
    collapse-tags
    :max-tag-count="1"
    searchable
    clearable
    :options="options"
  />
</template>
