<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <xy-space wrap>
    <xy-tooltip content="这里只放一句话提示，适合按钮解释和表头说明">
      <xy-button plain>Tooltip 提示</xy-button>
    </xy-tooltip>

    <xy-popover v-model="open" title="Popover 说明">
      <template #trigger>
        <xy-button plain>Popover 说明</xy-button>
      </template>
      <div class="xy-doc-stack">
        <p>这里可以放多段说明、状态解释，甚至一个轻量按钮。</p>
        <xy-button text @click="open = false">知道了</xy-button>
      </div>
    </xy-popover>
  </xy-space>
</template>
