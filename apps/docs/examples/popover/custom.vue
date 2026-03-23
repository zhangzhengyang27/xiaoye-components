<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <xy-popover v-model="open" width="360px" placement="bottom-start">
    <template #trigger>
      <xy-button type="primary">自定义头部</xy-button>
    </template>
    <template #header>
      <xy-space>
        <xy-tag status="primary">批量操作</xy-tag>
        <strong>导出前确认</strong>
      </xy-space>
    </template>
    <div class="xy-doc-stack">
      <p>Popover 更适合这种比 Tooltip 重一点、但又不需要阻断页面的说明内容。</p>
      <xy-space>
        <xy-button plain @click="open = false">取消</xy-button>
        <xy-button type="primary" @click="open = false">继续</xy-button>
      </xy-space>
    </div>
  </xy-popover>
</template>
