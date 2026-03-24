<script setup lang="ts">
import { ref } from "vue";

const scopes = ref<Array<string | number | boolean>>(["read"]);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-checkbox-group v-model="scopes" :min="1" :max="2">
      <xy-checkbox value="read">查看</xy-checkbox>
      <xy-checkbox value="edit">编辑</xy-checkbox>
      <xy-checkbox value="export">导出</xy-checkbox>
      <xy-checkbox value="delete">删除</xy-checkbox>
    </xy-checkbox-group>

    <xy-text size="sm">
      至少保留 1 项，最多选择 2 项。当前：{{ scopes.join("，") }}
    </xy-text>
  </div>
</template>
