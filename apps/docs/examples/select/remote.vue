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
  <!-- 选择器远程搜索：展示远程数据搜索功能 -->
  <div class="demo-select-remote">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-select-remote__header">
          <strong>远程搜索</strong>
          <xy-tag status="neutral" round>Remote</xy-tag>
        </div>
        <p class="demo-select-remote__description">
          输入关键词时从远程获取搜索结果，适合大数据量选项。
        </p>
      </template>

      <xy-select
        v-model="value"
        remote
        searchable
        clearable
        :loading="loading"
        :options="options"
        @search-change="handleSearchChange"
      />
    </xy-card>
  </div>
</template>

<style scoped>
.demo-select-remote {
  max-width: 400px;
}

.demo-select-remote__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-select-remote__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
