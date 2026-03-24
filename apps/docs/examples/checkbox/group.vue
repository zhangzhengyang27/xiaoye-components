<script setup lang="ts">
import { ref } from "vue";

const values = ref<Array<string | number | boolean>>(["api"]);
const options = [
  { label: "API", value: "api", description: "适合服务间调用" },
  { label: "OAuth", value: "oauth" },
  { label: "Legacy", value: "legacy", disabled: true }
];
</script>

<template>
  <div class="xy-doc-stack">
    <xy-checkbox-group v-model="values" direction="vertical" :options="options" />
    <xy-text size="sm">当前选中：{{ values.join("，") }}</xy-text>
  </div>
</template>
