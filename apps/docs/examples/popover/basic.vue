<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <xy-popover v-model="open" title="筛选说明">
    <template #trigger>
      <xy-button plain>点击打开 Popover</xy-button>
    </template>
    <div class="xy-doc-stack">
      <p>如果你需要解释筛选逻辑、权限差异或数据范围，Popover 比 Tooltip 更合适。</p>
      <xy-button text @click="open = false">知道了</xy-button>
    </div>
  </xy-popover>
</template>
