<script setup lang="ts">
import { ref } from "vue";
import type { SelectOption } from "xiaoye-components";

const value = ref<string | null>(null);
const options = ref<SelectOption<string>[]>([{ label: "初始化选项", value: "initial" }]);
const loading = ref(false);

function handleSearchChange(keyword: string) {
  loading.value = true;
  window.setTimeout(() => {
    options.value = keyword ? [{ label: `远程结果：${keyword}`, value: keyword }] : [];
    loading.value = false;
  }, 300);
}
</script>

<template>
  <xy-select
    v-model="value"
    remote
    searchable
    clearable
    :loading="loading"
    :options="options"
    @search-change="handleSearchChange"
  />
</template>
