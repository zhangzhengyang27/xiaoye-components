<script setup lang="ts">
import { ref } from "vue";
import type { AutoCompleteOption } from "xiaoye-components";

const keyword = ref("");
const loading = ref(false);
const options = ref<AutoCompleteOption<string>[]>([{ label: "初始化建议", value: "initial" }]);

function handleSearchChange(value: string) {
  loading.value = true;
  window.setTimeout(() => {
    options.value = value
      ? [{ label: `远程结果：${value}`, value }]
      : [{ label: "初始化建议", value: "initial" }];
    loading.value = false;
  }, 300);
}
</script>

<template>
  <xy-auto-complete
    v-model="keyword"
    remote
    clearable
    :loading="loading"
    :options="options"
    placeholder="远程搜索"
    @search-change="handleSearchChange"
  />
</template>
