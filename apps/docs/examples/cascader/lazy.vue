<script setup lang="ts">
import { ref } from "vue";

const value = ref<Array<string | number> | null>(null);
const options = [{ value: 1, label: "工作台", leaf: false }];

function load(option: { label: string }, resolve: (children: Array<{ value: number; label: string }>) => void) {
  window.setTimeout(() => {
    resolve([{ value: 11, label: `${option.label}-子项` }]);
  }, 300);
}
</script>

<template>
  <xy-cascader v-model="value" lazy :options="options" :load="load" />
</template>
